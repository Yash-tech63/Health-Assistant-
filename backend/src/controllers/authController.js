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

        const user = await User.findOne({ phone });
        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

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

        const verificationResult = await otpService.verifyOTP(phone, otp);

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
        const { phone, email, password } = req.body;
        const credential = phone || email;

        if (!credential || !password) {
            return next(ApiError.badRequest('Phone or Email and password are required'));
        }

        const user = await User.findOne({
            $or: [{ phone: credential }, { email: String(credential).toLowerCase() }]
        }).select('+password');

        if (!user) {
            return next(ApiError.unauthorized('Invalid credentials'));
        }

        if (user.isLocked()) {
            return next(ApiError.unauthorized('Account is locked. Please try again later.'));
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            await user.incrementLoginAttempts();
            return next(ApiError.unauthorized('Invalid credentials'));
        }

        if (!user.isPhoneVerified && process.env.ENABLE_OTP_VERIFICATION === 'true') {
            return next(ApiError.unauthorized('Phone number not verified'));
        }

        if (!user.isActive) {
            return next(ApiError.unauthorized('Account is deactivated'));
        }

        await user.resetLoginAttempts();
        const tokens = TokenGenerator.generateUserTokens(user);

        const refreshTokenKey = `refresh_token:${user._id}`;
        await redisClient.set(refreshTokenKey, tokens.refreshToken, 7 * 24 * 60 * 60);

        user.password = undefined;

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
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

        const decoded = TokenGenerator.verifyRefreshToken(refreshToken);
        if (!decoded) {
            return next(ApiError.unauthorized('Invalid refresh token'));
        }

        const refreshTokenKey = `refresh_token:${decoded.id}`;
        const storedToken = await redisClient.get(refreshTokenKey);

        if (!storedToken || storedToken !== refreshToken) {
            return next(ApiError.unauthorized('Refresh token is invalid or expired'));
        }

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return next(ApiError.unauthorized('User no longer exists or is inactive'));
        }

        const newTokens = TokenGenerator.generateUserTokens(user);
        await redisClient.set(refreshTokenKey, newTokens.refreshToken, 7 * 24 * 60 * 60);

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
        const refreshTokenKey = `refresh_token:${user._id}`;
        await redisClient.del(refreshTokenKey);

        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logout successful',
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

        res.status(200).json({
            success: true,
            data: { user },
        });
    });

    /**
     * @desc    Update user profile
     * @route   PUT /api/auth/me
     * @access  Private
     */
    updateMe = asyncHandler(async (req, res, next) => {
        const allowedFields = ['name', 'email', 'avatar', 'gender', 'dateOfBirth', 'address'];
        const updates = {};

        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user },
        });
    });

    /**
     * @desc    Change password
     * @route   PUT /api/auth/change-password
     * @access  Private
     */
    changePassword = asyncHandler(async (req, res, next) => {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return next(ApiError.badRequest('Current password and new password are required'));
        }

        const user = await User.findById(req.user._id).select('+password');
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return next(ApiError.unauthorized('Current password is incorrect'));
        }

        user.password = newPassword;
        await user.save();

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

        const user = await User.findOne({ phone });
        if (!user) {
            return next(ApiError.notFound('User not found with this phone number'));
        }

        const result = await otpService.generateAndStoreOTP(phone);

        res.status(200).json({
            success: true,
            message: 'Password reset OTP sent successfully',
            data: {
                phone: phone,
                expirySeconds: result.expirySeconds,
            },
        });
    });

    /**
     * @desc    Reset password with OTP
     * @route   POST /api/auth/reset-password
     * @access  Public
     */
    resetPassword = asyncHandler(async (req, res, next) => {
        const { phone, otp, newPassword } = req.body;

        if (!phone || !otp || !newPassword) {
            return next(ApiError.badRequest('Phone, OTP, and new password are required'));
        }

        await otpService.verifyOTP(phone, otp);

        const user = await User.findOne({ phone });
        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

        user.password = newPassword;
        await user.save();

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

module.exports = new AuthController();
