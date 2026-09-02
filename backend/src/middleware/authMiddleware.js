const TokenGenerator = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * Authentication middleware
 */
class AuthMiddleware {
    /**
     * Verify JWT token
     */
    static verifyToken = async (req, res, next) => {
        try {
            // Get token from header
            const authHeader = req.headers.authorization;
            const token = TokenGenerator.extractTokenFromHeader(authHeader);

            if (!token) {
                return next(ApiError.unauthorized('Authentication token required'));
            }

            // Verify token
            const decoded = TokenGenerator.verifyAccessToken(token);

            if (!decoded) {
                return next(ApiError.unauthorized('Invalid or expired token'));
            }

            // Check if user still exists
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(ApiError.unauthorized('User no longer exists'));
            }

            if (!user.isActive) {
                return next(ApiError.unauthorized('User account is deactivated'));
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            next(ApiError.unauthorized('Authentication failed'));
        }
    };

    /**
     * Check if phone is verified
     */
    static requirePhoneVerified = (req, res, next) => {
        if (!req.user.isPhoneVerified) {
            return next(ApiError.forbidden('Phone number must be verified'));
        }
        next();
    };

    /**
     * Verify refresh token
     */
    static verifyRefreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return next(ApiError.unauthorized('Refresh token required'));
            }

            const decoded = TokenGenerator.verifyRefreshToken(refreshToken);

            if (!decoded) {
                return next(ApiError.unauthorized('Invalid refresh token'));
            }

            // Check if user exists
            const user = await User.findById(decoded.id);

            if (!user) {
                return next(ApiError.unauthorized('User no longer exists'));
            }

            // Check if refresh token is blacklisted (in Redis)
            // This would require Redis implementation for token blacklisting
            // For now, we'll just verify the token

            req.user = user;
            next();
        } catch (error) {
            next(ApiError.unauthorized('Refresh token validation failed'));
        }
    };

    /**
     * Optional authentication
     */
    static optionalAuth = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const token = TokenGenerator.extractTokenFromHeader(authHeader);

            if (token) {
                const decoded = TokenGenerator.verifyAccessToken(token);

                if (decoded) {
                    const user = await User.findById(decoded.id).select('-password');

                    if (user && user.isActive) {
                        req.user = user;
                    }
                }
            }
            next();
        } catch (error) {
            // Don't throw error for optional auth
            next();
        }
    };

    /**
     * Check if user has any of the specified roles
     */
    static authorizeRoles = (...roles) => {
        return (req, res, next) => {
            if (!req.user) {
                return next(ApiError.unauthorized('Authentication required'));
            }

            if (!roles.includes(req.user.role)) {
                return next(ApiError.forbidden('Insufficient permissions'));
            }

            next();
        };
    };

    /**
     * Check if user is accessing their own resource
     */
    static authorizeSelf = (paramName = 'id') => {
        return (req, res, next) => {
            const resourceId = req.params[paramName];

            // If user is admin, allow access
            if (req.user.role === 'admin') {
                return next();
            }

            // Check if user is accessing their own resource
            if (req.user._id.toString() !== resourceId) {
                return next(ApiError.forbidden('Cannot access other user resources'));
            }

            next();
        };
    };

    /**
     * Rate limiting for authentication endpoints
     */
    static createAuthRateLimiter(limit, windowMs) {
        return (req, res, next) => {
            // Implementation would depend on Redis or in-memory store
            // For now, we'll use express-rate-limit at route level
            next();
        };
    }
}

module.exports = AuthMiddleware;