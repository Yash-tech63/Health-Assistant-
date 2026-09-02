const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const AuthMiddleware = require('../middleware/authMiddleware');
const RateLimiter = require('../middleware/rateLimiter');

// Rate limiting for authentication endpoints
const authLimiter = RateLimiter.authLimiter();
const otpLimiter = RateLimiter.otpLimiter();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, authController.register);

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP for phone verification
 * @access  Public
 */
router.post('/send-otp', otpLimiter, authController.sendOTP);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP
 * @access  Public
 */
router.post('/verify-otp', otpLimiter, authController.verifyOTP);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, authController.login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', AuthMiddleware.verifyToken, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', AuthMiddleware.verifyToken, authController.getMe);

/**
 * @route   PUT /api/auth/me
 * @desc    Update user profile
 * @access  Private
 */
router.put('/me', AuthMiddleware.verifyToken, authController.updateMe);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.put('/change-password', AuthMiddleware.verifyToken, authController.changePassword);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset OTP
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with OTP
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   GET /api/auth/check-phone/:phone
 * @desc    Check phone availability
 * @access  Public
 */
router.get('/check-phone/:phone', authController.checkPhoneAvailability);

/**
 * @route   GET /api/auth/validate-token
 * @desc    Validate token
 * @access  Private
 */
router.get('/validate-token', AuthMiddleware.verifyToken, authController.validateToken);

module.exports = router;