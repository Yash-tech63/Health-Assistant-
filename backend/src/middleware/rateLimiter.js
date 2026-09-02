const rateLimit = require('express-rate-limit');
const redisClient = require('../config/redis');

/**
 * Rate limiting middleware
 */
class RateLimiter {
    /**
     * Create Redis store for rate limiting
     */
    static createRedisStore() {
        // For production, use Redis store
        // This is a simplified implementation
        return {
            increment: async (key) => {
                try {
                    const current = await redisClient.get(key) || 0;
                    const newCount = parseInt(current) + 1;
                    await redisClient.set(key, newCount.toString(), 60);
                    return newCount;
                } catch (error) {
                    console.error('Redis store error:', error);
                    return 1;
                }
            },
            decrement: async (key) => {
                try {
                    const current = await redisClient.get(key) || 0;
                    const newCount = Math.max(0, parseInt(current) - 1);
                    await redisClient.set(key, newCount.toString(), 60);
                    return newCount;
                } catch (error) {
                    console.error('Redis store error:', error);
                    return 0;
                }
            },
            resetKey: async (key) => {
                try {
                    await redisClient.del(key);
                } catch (error) {
                    console.error('Redis reset error:', error);
                }
            },
        };
    }

    /**
     * Create basic rate limiter
     */
    static basicLimiter(windowMs, max) {
        return rateLimit({
            windowMs: windowMs,
            max: max,
            message: {
                success: false,
                message: 'Too many requests from this IP, please try again later',
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
    }

    /**
     * Authentication rate limiter
     */
    static authLimiter() {
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // 5 attempts per windowMs
            message: {
                success: false,
                message: 'Too many login attempts, please try again later',
            },
            skipSuccessfulRequests: true,
        });
    }

    /**
     * OTP rate limiter
     */
    static otpLimiter() {
        return rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 3, // 3 OTP requests per minute
            message: {
                success: false,
                message: 'Too many OTP requests, please wait before requesting again',
            },
        });
    }

    /**
     * API rate limiter
     */
    static apiLimiter() {
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // 100 requests per windowMs
            message: {
                success: false,
                message: 'Too many API requests, please try again later',
            },
        });
    }

    /**
     * Create rate limiter with Redis store
     */
    static createRedisLimiter(windowMs, max, keyGenerator = null) {
        return rateLimit({
            windowMs: windowMs,
            max: max,
            store: this.createRedisStore(),
            keyGenerator: keyGenerator || ((req) => {
                // Default key generator: IP + path
                return `${req.ip}:${req.path}`;
            }),
            handler: (req, res, next, options) => {
                res.status(429).json({
                    success: false,
                    message: options.message,
                    retryAfter: Math.ceil(options.windowMs / 1000),
                });
            },
        });
    }

    /**
     * User-specific rate limiter
     */
    static userLimiter(windowMs, max) {
        return rateLimit({
            windowMs: windowMs,
            max: max,
            keyGenerator: (req) => {
                // Use user ID if authenticated, otherwise use IP
                return req.user ? req.user.id : req.ip;
            },
            message: {
                success: false,
                message: 'Too many requests from your account, please try again later',
            },
        });
    }

    /**
     * Per-route rate limiter
     */
    static routeLimiter(route, windowMs, max) {
        return rateLimit({
            windowMs: windowMs,
            max: max,
            keyGenerator: (req) => {
                return `${req.ip}:${route}`;
            },
            message: {
                success: false,
                message: `Too many requests to ${route}, please try again later`,
            },
        });
    }

    /**
     * Whitelist certain IPs
     */
    static createWhitelistLimiter(whitelistIPs = []) {
        return (req, res, next) => {
            if (whitelistIPs.includes(req.ip)) {
                return next();
            }
            return this.apiLimiter()(req, res, next);
        };
    }

    /**
     * Rate limiting for specific user roles
     */
    static roleBasedLimiter(roles, windowMs, max) {
        return (req, res, next) => {
            if (req.user && roles.includes(req.user.role)) {
                return next();
            }
            return this.userLimiter(windowMs, max)(req, res, next);
        };
    }

    /**
     * Rate limiting headers middleware
     */
    static rateLimitHeaders(req, res, next) {
        res.setHeader('X-RateLimit-Limit', req.rateLimit.limit || 100);
        res.setHeader('X-RateLimit-Remaining', req.rateLimit.remaining || 99);
        res.setHeader('X-RateLimit-Reset', req.rateLimit.resetTime || Date.now() + 900000);
        next();
    }
}

module.exports = RateLimiter;