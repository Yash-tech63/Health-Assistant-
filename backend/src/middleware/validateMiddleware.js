const ApiError = require('../utils/ApiError');

/**
 * Validation middleware using Zod schemas
 */
class ValidateMiddleware {
    /**
     * Validate request body against Zod schema
     */
    static validate(schema) {
        return (req, res, next) => {
            try {
                // Validate request body
                const result = schema.safeParse(req.body);

                if (!result.success) {
                    const errors = result.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    }));

                    return next(ApiError.validationError('Validation failed', errors));
                }

                // Replace body with validated data
                req.body = result.data;
                next();
            } catch (error) {
                next(ApiError.validationError('Validation error'));
            }
        };
    }

    /**
     * Validate request query against Zod schema
     */
    static validateQuery(schema) {
        return (req, res, next) => {
            try {
                const result = schema.safeParse(req.query);

                if (!result.success) {
                    const errors = result.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    }));

                    return next(ApiError.validationError('Query validation failed', errors));
                }

                req.query = result.data;
                next();
            } catch (error) {
                next(ApiError.validationError('Query validation error'));
            }
        };
    }

    /**
     * Validate request params against Zod schema
     */
    static validateParams(schema) {
        return (req, res, next) => {
            try {
                const result = schema.safeParse(req.params);

                if (!result.success) {
                    const errors = result.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    }));

                    return next(ApiError.validationError('Parameter validation failed', errors));
                }

                req.params = result.data;
                next();
            } catch (error) {
                next(ApiError.validationError('Parameter validation error'));
            }
        };
    }

    /**
     * Validate request files
     */
    static validateFile(allowedTypes = [], maxSize = 5 * 1024 * 1024) { // 5MB default
        return (req, res, next) => {
            try {
                if (!req.file && !req.files) {
                    return next(ApiError.badRequest('No file uploaded'));
                }

                // Handle single file
                if (req.file) {
                    const file = req.file;

                    // Check file type
                    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
                        return next(ApiError.badRequest(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
                    }

                    // Check file size
                    if (file.size > maxSize) {
                        return next(ApiError.badRequest(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`));
                    }
                }

                // Handle multiple files
                if (req.files) {
                    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

                    for (const file of files) {
                        // Check file type
                        if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
                            return next(ApiError.badRequest(`Invalid file type for ${file.originalname}. Allowed: ${allowedTypes.join(', ')}`));
                        }

                        // Check file size
                        if (file.size > maxSize) {
                            return next(ApiError.badRequest(`File ${file.originalname} too large. Maximum size: ${maxSize / (1024 * 1024)}MB`));
                        }
                    }
                }

                next();
            } catch (error) {
                next(ApiError.validationError('File validation error'));
            }
        };
    }

    /**
     * Validate request against multiple schemas
     */
    static validateMultiple(schemas) {
        return (req, res, next) => {
            try {
                const errors = [];

                // Validate body
                if (schemas.body) {
                    const bodyResult = schemas.body.safeParse(req.body);
                    if (!bodyResult.success) {
                        errors.push(
                            ...bodyResult.error.errors.map(err => ({
                                field: `body.${err.path.join('.')}`,
                                message: err.message,
                            }))
                        );
                    } else {
                        req.body = bodyResult.data;
                    }
                }

                // Validate query
                if (schemas.query) {
                    const queryResult = schemas.query.safeParse(req.query);
                    if (!queryResult.success) {
                        errors.push(
                            ...queryResult.error.errors.map(err => ({
                                field: `query.${err.path.join('.')}`,
                                message: err.message,
                            }))
                        );
                    } else {
                        req.query = queryResult.data;
                    }
                }

                // Validate params
                if (schemas.params) {
                    const paramsResult = schemas.params.safeParse(req.params);
                    if (!paramsResult.success) {
                        errors.push(
                            ...paramsResult.error.errors.map(err => ({
                                field: `params.${err.path.join('.')}`,
                                message: err.message,
                            }))
                        );
                    } else {
                        req.params = paramsResult.data;
                    }
                }

                if (errors.length > 0) {
                    return next(ApiError.validationError('Multiple validation errors', errors));
                }

                next();
            } catch (error) {
                next(ApiError.validationError('Validation error'));
            }
        };
    }

    /**
     * Validate pagination parameters
     */
    static validatePagination = (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1) {
            return next(ApiError.badRequest('Page must be at least 1'));
        }

        if (limit < 1 || limit > 100) {
            return next(ApiError.badRequest('Limit must be between 1 and 100'));
        }

        req.query.page = page;
        req.query.limit = limit;
        next();
    };

    /**
     * Validate date range parameters
     */
    static validateDateRange = (req, res, next) => {
        const { startDate, endDate } = req.query;

        if (startDate) {
            const start = new Date(startDate);
            if (isNaN(start.getTime())) {
                return next(ApiError.badRequest('Invalid start date'));
            }
            req.query.startDate = start;
        }

        if (endDate) {
            const end = new Date(endDate);
            if (isNaN(end.getTime())) {
                return next(ApiError.badRequest('Invalid end date'));
            }
            req.query.endDate = end;
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start > end) {
                return next(ApiError.badRequest('Start date cannot be after end date'));
            }
        }

        next();
    };

    /**
     * Validate phone number
     */
    static validatePhone = (req, res, next) => {
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;

        if (req.body.phone && !phoneRegex.test(req.body.phone)) {
            return next(ApiError.badRequest('Invalid phone number format'));
        }

        next();
    };

    /**
     * Validate email
     */
    static validateEmail = (req, res, next) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (req.body.email && !emailRegex.test(req.body.email)) {
            return next(ApiError.badRequest('Invalid email format'));
        }

        next();
    };

    /**
     * Validate password strength
     */
    static validatePassword = (req, res, next) => {
        const password = req.body.password || req.body.newPassword;

        if (password) {
            // Minimum 8 characters, at least one uppercase, one lowercase, one number
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!passwordRegex.test(password)) {
                return next(ApiError.badRequest(
                    'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
                ));
            }
        }

        next();
    };
}

module.exports = ValidateMiddleware;