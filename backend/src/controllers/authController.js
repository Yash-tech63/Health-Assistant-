const User = require('../models/User');
const Patient = require('../models/Patient');
const TokenGenerator = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const otpService = require('../services/otpService');
const redisClient = require('../config/redis');

const normalizePhone = (value) => String(value ?? '').trim();

const buildPatientProfile = (user, payload = {}) => ({
    user: user._id,
    fullName: payload.fullName || user.name,
    dateOfBirth: payload.dateOfBirth,
    gender: payload.gender,
    bloodGroup: payload.bloodGroup || null,
    phone: normalizePhone(payload.phone || user.phone),
    email: payload.email || user.email || null,
    address: payload.address || {},
    emergencyContact: payload.emergencyContact || {},
    preferredLanguage: payload.preferredLanguage || 'en',
    preferredCommunication: payload.preferredCommunication || ['sms'],
});

/**
 * Authentication Controller
 */
class AuthController {
    /**
     * @desc    Register a new user
     * @route   POST /api/auth/register
     * @access  Public
     */
    register = asyncHandler(async (req, res, next) => {
        const {
            name,
            phone,
            password,
            confirmPassword,
            email,
            role,
            fullName,
            dateOfBirth,
            gender,
            bloodGroup,
            address,
            emergencyContact,
            preferredLanguage,
            preferredCommunication,
        } = req.body;

        const normalizedPhone = normalizePhone(phone);
        const displayName = (fullName || name || '').trim();
        const selectedRole = role || 'patient';

        // Validate required identity fields
        if (!displayName || !normalizedPhone || !password) {
            return next(ApiError.badRequest('Name, phone, and password are required'));
        }

        if (password !== confirmPassword) {
            return next(ApiError.badRequest('Passwords do not match'));
        }

        const allowedRoles = ['patient', 'doctor', 'health_worker', 'admin'];
        if (!allowedRoles.includes(selectedRole)) {
            return next(ApiError.badRequest('Invalid user role'));
        }

        const existingUser = await User.findOne({ phone: normalizedPhone });
        if (existingUser) {
            return next(ApiError.conflict('User with this phone already exists'));
        }

        const user = await User.create({
            name: displayName,
            phone: normalizedPhone,
            password,
            email,
            role: selectedRole,
        });

        if (selectedRole === 'patient') {
            if (!displayName || !dateOfBirth || !gender) {
                await User.deleteOne({ _id: user._id });
                return next(ApiError.badRequest('Patient registration requires fullName, dateOfBirth and gender'));
            }

            await Patient.create(buildPatientProfile(user, {
                fullName: displayName,
                dateOfBirth,
                gender,
                bloodGroup,
                address,
                emergencyContact,
                preferredLanguage,
                preferredCommunication,
                phone: normalizedPhone,
                email,
            }));
        }

        await otpService.generateAndStoreOTP(normalizedPhone);

        user.password = undefined;

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please verify your phone.',
            data: { user },
        });
    });

    /**
     * @desc    Send OTP for phone verification
     * @route   POST /api/auth/send-otp
     * @access  Public
     */
    sendOTP = asyncHandler(async (req, res, next) => {
        const { phone } = req.body;

        if (!phone) {
            return next(ApiError.badRequest('Phone number is required'));
        }

        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

        // Generate and store OTP
        const result = await otpService.generateAndStoreOTP(phone);

        res.status(200).json({
            success: true,
            message: result.message,
            data: {
                phone: phone,
                expirySeconds: result.expirySeconds,
            },
        });
    });

    /**
     * @desc    Verify OTP
     * @route   POST /api/auth/verify-otp
     * @access  Public
     */
    verifyOTP = asyncHandler(async (req, res, next) => {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return next(ApiError.badRequest('Phone and OTP are required'));
        }

        // Verify OTP
        const verificationResult = await otpService.verifyOTP(phone, otp);

        // Update user's phone verification status
        await User.findOneAndUpdate(
            { phone },
            { isPhoneVerified: true, updatedAt: Date.now() }
        );

        res.status(200).json({
            success: true,
            message: verificationResult.message,
            data: {
                phone: phone,
                verifiedAt: verificationResult.verifiedAt,
            },
        });
    });

    /**
     * @desc    Login user
     * @route   POST /api/auth/login
     * @access  Public
     */
    login = asyncHandler(async (req, res, next) => {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return next(ApiError.badRequest('Phone and password are required'));
        }

        // Find user with password
        const user = await User.findOne({ phone }).select('+password');

        if (!user) {
            return next(ApiError.unauthorized('Invalid credentials'));
        }

        // Check if account is locked
        if (user.isLocked()) {
            return next(ApiError.unauthorized('Account is locked. Please try again later.'));
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            // Increment login attempts
            await user.incrementLoginAttempts();
            return next(ApiError.unauthorized('Invalid credentials'));
        }

        // Check if phone is verified
        if (!user.isPhoneVerified && process.env.ENABLE_OTP_VERIFICATION === 'true') {
            return next(ApiError.unauthorized('Phone number not verified'));
        }

        // Check if account is active
        if (!user.isActive) {
            return next(ApiError.unauthorized('Account is deactivated'));
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();

        // Generate tokens
        const tokens = TokenGenerator.generateUserTokens(user);

        // Store refresh token in Redis (optional, for token blacklisting)
        const refreshTokenKey = `refresh_token:${user._id}`;
        await redisClient.set(refreshTokenKey, tokens.refreshToken, 7 * 24 * 60 * 60); // 7 days

        // Remove password from response
        user.password = undefined;

        // Set cookies (optional)
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            },
        });
    });

    /**
     * @desc    Refresh access token
     * @route   POST /api/auth/refresh-token
     * @access  Public (requires refresh token)
     */
    refreshToken = asyncHandler(async (req, res, next) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(ApiError.unauthorized('Refresh token is required'));
        }

        // Verify refresh token
        const decoded = TokenGenerator.verifyRefreshToken(refreshToken);
        if (!decoded) {
            return next(ApiError.unauthorized('Invalid refresh token'));
        }

        // Check if refresh token is blacklisted (optional)
        const refreshTokenKey = `refresh_token:${decoded.id}`;
        const storedToken = await redisClient.get(refreshTokenKey);

        if (!storedToken || storedToken !== refreshToken) {
            return next(ApiError.unauthorized('Refresh token is invalid or expired'));
        }

        // Find user
        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return next(ApiError.unauthorized('User no longer exists or is inactive'));
        }

        // Generate new tokens
        const newTokens = TokenGenerator.generateUserTokens(user);

        // Update refresh token in Redis
        await redisClient.set(refreshTokenKey, newTokens.refreshToken, 7 * 24 * 60 * 60);

        // Update cookie
        res.cookie('refreshToken', newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            },
        });
    });

    /**
     * @desc    Logout user
     * @route   POST /api/auth/logout
     * @access  Private
     */
    logout = asyncHandler(async (req, res, next) => {
        const { user } = req;

        // Clear refresh token from Redis
        const refreshTokenKey = `refresh_token:${user._id}`;
        await redisClient.del(refreshTokenKey);

        // Clear cookie
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    });

    /**
     * @desc    Get current user profile
     * @route   GET /api/auth/me
     * @access  Private
     */
    getMe = asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

        let profile = user.toObject();

        // Add role-specific data
        if (user.role === 'patient') {
            const patient = await Patient.findOne({ user: user._id });
            if (patient) {
                profile.patientData = patient;
            }
        } else if (user.role === 'doctor') {
            // You would fetch doctor profile here
            // const doctor = await Doctor.findOne({ user: user._id });
            // if (doctor) {
            //   profile.doctorData = doctor;
            // }
        }

        res.status(200).json({
            success: true,
            data: profile,
        });
    });

    /**
     * @desc    Update user profile
     * @route   PUT /api/auth/me
     * @access  Private
     */
    updateMe = asyncHandler(async (req, res, next) => {
        const { name, email } = req.body;
        const userId = req.user._id;

        // Fields that can be updated
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        // Update user
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    });

    /**
     * @desc    Change password
     * @route   PUT /api/auth/change-password
     * @access  Private
     */
    changePassword = asyncHandler(async (req, res, next) => {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user._id;

        // Validate new password confirmation
        if (newPassword !== confirmPassword) {
            return next(ApiError.badRequest('New passwords do not match'));
        }

        // Find user with password
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return next(ApiError.unauthorized('Current password is incorrect'));
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Invalidate all refresh tokens (optional security measure)
        const refreshTokenKey = `refresh_token:${user._id}`;
        await redisClient.del(refreshTokenKey);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    });

    /**
     * @desc    Request password reset OTP
     * @route   POST /api/auth/forgot-password
     * @access  Public
     */
    forgotPassword = asyncHandler(async (req, res, next) => {
        const { phone } = req.body;

        if (!phone) {
            return next(ApiError.badRequest('Phone number is required'));
        }

        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            // Don't reveal that user doesn't exist for security
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this phone, a reset OTP has been sent',
            });
        }

        // Generate password reset OTP
        const resetToken = generateOTP(6);
        const resetTokenKey = `password_reset:${phone}`;

        // Store reset token in Redis (10 minutes expiry)
        await redisClient.set(resetTokenKey, {
            token: resetToken,
            phone: phone,
            attempts: 0,
            generatedAt: Date.now(),
        }, 600); // 10 minutes

        // In production, send OTP via SMS
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔐 Password reset OTP for ${phone}: ${resetToken}`);
        }

        res.status(200).json({
            success: true,
            message: 'Password reset OTP sent',
        });
    });

    /**
     * @desc    Reset password with OTP
     * @route   POST /api/auth/reset-password
     * @access  Public
     */
    resetPassword = asyncHandler(async (req, res, next) => {
        const { phone, otp, newPassword, confirmPassword } = req.body;

        if (!phone || !otp || !newPassword || !confirmPassword) {
            return next(ApiError.badRequest('All fields are required'));
        }

        // Validate password confirmation
        if (newPassword !== confirmPassword) {
            return next(ApiError.badRequest('Passwords do not match'));
        }

        // Verify reset OTP
        const resetTokenKey = `password_reset:${phone}`;
        const resetData = await redisClient.get(resetTokenKey);

        if (!resetData) {
            return next(ApiError.badRequest('Reset OTP expired or not found'));
        }

        if (resetData.token !== otp) {
            // Increment attempts
            resetData.attempts += 1;
            await redisClient.set(resetTokenKey, resetData, 600);

            if (resetData.attempts >= 3) {
                await redisClient.del(resetTokenKey);
                return next(ApiError.badRequest('Maximum OTP attempts exceeded. Please request new OTP.'));
            }

            const attemptsLeft = 3 - resetData.attempts;
            return next(ApiError.badRequest(`Invalid OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left.`));
        }

        // Find user
        const user = await User.findOne({ phone });
        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Delete reset token
        await redisClient.del(resetTokenKey);

        // Invalidate all refresh tokens
        const refreshTokenKey = `refresh_token:${user._id}`;
        await redisClient.del(refreshTokenKey);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    });

    /**
     * @desc    Check phone availability
     * @route   GET /api/auth/check-phone/:phone
     * @access  Public
     */
    checkPhoneAvailability = asyncHandler(async (req, res, next) => {
        const { phone } = req.params;

        const user = await User.findOne({ phone });

        res.status(200).json({
            success: true,
            data: {
                phone: phone,
                available: !user,
                exists: !!user,
            },
        });
    });

    /**
     * @desc    Validate token
     * @route   GET /api/auth/validate-token
     * @access  Private
     */
    validateToken = asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return next(ApiError.unauthorized('Invalid token'));
        }

        res.status(200).json({
            success: true,
            data: {
                user,
                valid: true,
            },
        });
    });
}

// Helper function for OTP generation (for password reset)
function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        otp += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return otp;
}

module.exports = new AuthController();
