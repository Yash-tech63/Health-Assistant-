require('dotenv').config();
const http = require('http');

const app = require('./app');
const connectDB = require('./config/db');
const redisClient = require('./config/redis');
const socketManager = require('./config/socket');
const ErrorMiddleware = require('./middleware/errorMiddleware');

/**
 * Server Configuration
 */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start Server
 */
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log(' Database connected successfully');

        // Connect to Redis
        await redisClient.connect();
        console.log(' Redis connected successfully');

        // Create HTTP server
        const server = http.createServer(app);

        // Initialize Socket.IO
        socketManager.init(server);
        console.log(' Socket.IO initialized');

        // Handle unhandled promise rejections
        ErrorMiddleware.handleUnhandledRejection();

        // Handle uncaught exceptions
        ErrorMiddleware.handleUncaughtException();

        // Start server
        server.listen(PORT, () => {
            console.log(`
 Server running in ${NODE_ENV} mode
 Port: ${PORT}
 Health Check: http://localhost:${PORT}/api/health
 API Docs: http://localhost:${PORT}/api-docs
 Server Time: ${new Date().toISOString()}
      `);
        });

        // Handle server shutdown
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        console.error(' Failed to start server:', error);
        process.exit(1);
    }
};

/**
 * Graceful shutdown
 */
const gracefulShutdown = async () => {
    console.log('\n Received shutdown signal, shutting down gracefully...');

    try {
        // Disconnect from Redis
        await redisClient.disconnect();
        console.log(' Redis connection closed');

        // Close server
        process.exit(0);
    } catch (error) {
        console.error(' Failed to shut down server:', error);
        process.exit(1);
    }
};

/**
 * Start the server
 */
startServer();

module.exports = startServer;