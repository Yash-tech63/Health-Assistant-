/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(statusCode, message, errors = [], isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.isOperational = isOperational;
        this.success = false;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Create bad request error
     */
    static badRequest(message = 'Bad Request', errors = []) {
        return new ApiError(400, message, errors);
    }

    /**
     * Create unauthorized error
     */
    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, message);
    }

    /**
     * Create forbidden error
     */
    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }

    /**
     * Create not found error
     */
    static notFound(message = 'Resource not found') {
        return new ApiError(404, message);
    }

    /**
     * Create conflict error
     */
    static conflict(message = 'Conflict occurred') {
        return new ApiError(409, message);
    }

    /**
     * Create validation error
     */
    static validationError(message = 'Validation failed', errors = []) {
        return new ApiError(422, message, errors);
    }

    /**
     * Create internal server error
     */
    static internal(message = 'Internal server error') {
        return new ApiError(500, message);
    }

    /**
     * Create service unavailable error
     */
    static serviceUnavailable(message = 'Service temporarily unavailable') {
        return new ApiError(503, message);
    }

    /**
     * Convert to response object
     */
    toResponse() {
        return {
            success: false,
            message: this.message,
            errors: this.errors,
            timestamp: this.timestamp,
        };
    }
}

module.exports = ApiError;