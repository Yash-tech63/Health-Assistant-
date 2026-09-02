/**
 * CORS Configuration for Frontend Integration
 */

// Default allowed origins
const defaultOrigins = [
    'http://localhost:3000',      // React, Next.js default
    'http://localhost:5173',      // Vite default
    'http://localhost:8080',      // Vue, Angular default
    'http://localhost:19006',     // Expo web
    'http://localhost:19000',     // Expo dev client
    'http://localhost:19001',     // Expo dev tools
];

/**
 * Get allowed origins from environment variables
 */
function getAllowedOrigins() {
    const origins = [...defaultOrigins];

    // Add CLIENT_URL if set
    if (process.env.CLIENT_URL) {
        origins.push(process.env.CLIENT_URL);
    }

    // Add CLIENT_URLS if set (comma-separated)
    if (process.env.CLIENT_URLS) {
        const urls = process.env.CLIENT_URLS.split(',').map(url => url.trim());
        origins.push(...urls);
    }

    // Remove duplicates
    return [...new Set(origins)];
}

/**
 * CORS options configuration
 */
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) {
            return callback(null, true);
        }

        const allowedOrigins = getAllowedOrigins();

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // For development, allow all origins with warning
            if (process.env.NODE_ENV === 'development') {
                console.warn(`⚠️  CORS: Allowing origin ${origin} in development mode`);
                callback(null, true);
            } else {
                console.error(`❌ CORS: Blocked origin ${origin}`);
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Cache-Control',
        'Pragma',
        'X-API-Key',
        'X-Client-Version',
    ],
    exposedHeaders: [
        'Content-Length',
        'Content-Type',
        'Authorization',
        'X-Powered-By',
        'X-Request-Id',
        'X-Response-Time',
    ],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

/**
 * Socket.IO CORS configuration
 */
const socketCorsOptions = {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = {
    corsOptions,
    socketCorsOptions,
    getAllowedOrigins,
};