const ApiError = require('../utils/ApiError');

/**
 * Error handling middleware
 */
class ErrorMiddleware {
    /**
     * Not found handler
     */
    static notFound(req, res, next) {
        next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
    }

    /**
     * Global error handler
     */
    static errorHandler(err, req, res, next) {
        let error = { ...err };
        error.message = err.message;
        error.statusCode = err.statusCode || 500;

        // Log error for debugging
        if (process.env.NODE_ENV === 'development') {
            console.error('❌ Error:', {
                message: error.message,
                stack: error.stack,
                path: req.path,
                method: req.method,
                body: req.body,
                query: req.query,
            });
        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            error = ApiError.conflict(`Duplicate field value: ${field} '${value}' already exists`);
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((e) => ({
                field: e.path,
                message: e.message,
            }));
            error = ApiError.validationError('Validation failed', errors);
        }

        // Mongoose CastError (invalid ObjectId)
        if (err.name === 'CastError') {
            error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
        }

        // JWT errors
        if (err.name === 'JsonWebTokenError') {
            error = ApiError.unauthorized('Invalid token');
        }

        if (err.name === 'TokenExpiredError') {
            error = ApiError.unauthorized('Token expired');
        }

        // Zod validation error
        if (err.name === 'ZodError') {
            const errors = err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            error = ApiError.validationError('Validation failed', errors);
        }

        // Redis connection error
        if (err.message && err.message.includes('Redis')) {
            error = ApiError.serviceUnavailable('Cache service unavailable');
        }

        // MongoDB connection error
        if (err.message && err.message.includes('Mongo')) {
            error = ApiError.serviceUnavailable('Database service temporarily unavailable');
        }

        // Check if it's an operational error
        if (!error.isOperational) {
            // Log unexpected errors
            console.error('💥 Unexpected Error:', {
                name: err.name,
                message: err.message,
                stack: err.stack,
            });

            // Don't expose internal errors in production
            if (process.env.NODE_ENV === 'production') {
                error.message = 'Internal server error';
                error.errors = [];
            }
        }

        // Response
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors || [],
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        });
    }

    /**
     * Handle async errors
     */
    static catchAsync(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }

    /**
     * Handle unhandled promise rejections
     */
    static handleUnhandledRejection() {
        process.on('unhandledRejection', (err) => {
            console.error('💥 Unhandled Promise Rejection:', err);

            // Graceful shutdown
            process.exit(1);
        });
    }

    /**
     * Handle uncaught exceptions
     */
    static handleUncaughtException() {
        process.on('uncaughtException', (err) => {
            console.error('💥 Uncaught Exception:', err);

            // Graceful shutdown
            process.exit(1);
        });
    }
}

module.exports = ErrorMiddleware;