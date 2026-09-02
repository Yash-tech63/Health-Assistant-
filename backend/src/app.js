const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const ErrorMiddleware = require('./middleware/errorMiddleware');
const swaggerSpec = require('./docs/swagger');
const { corsOptions } = require('./config/cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const queueRoutes = require('./routes/queueRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const labReportRoutes = require('./routes/labReportRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const referralRoutes = require('./routes/referralRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const teleconsultationRoutes = require('./routes/teleconsultationRoutes');
const followUpRoutes = require('./routes/followUpRoutes');
const mongoose = require('mongoose');
const redisClient = require('./config/redis');

/**
 * Express Application
 */
class App {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    /**
     * Setup middleware
     */
    setupMiddleware() {
        // Security headers
        this.app.use(helmet());

        // CORS configuration
        this.app.use(cors(corsOptions));

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Logging
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        } else {
            this.app.use(morgan('combined'));
        }

        // Static files
        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

        // Request logging (custom)
        this.app.use((req, res, next) => {
            req.requestTime = new Date().toISOString();
            console.log(`${req.method} ${req.path} - ${req.requestTime}`);
            next();
        });
    }

    /**
     * Setup routes
     */
    setupRoutes() {
        // Health check endpoint
        const health = (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Healthcare API is running',
                timestamp: new Date().toISOString(),
                services: { mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', redis: redisClient.isConnected ? 'connected' : 'disconnected' },
            });
        };
        this.app.get('/health', health);
        this.app.get('/api/health', health);

        // API Documentation
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // API Routes
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/patients', patientRoutes);
        this.app.use('/api/facilities', facilityRoutes);
        this.app.use('/api/doctors', doctorRoutes);
        this.app.use('/api/appointments', appointmentRoutes);
        this.app.use('/api/queue', queueRoutes);
        this.app.use('/api/medical-records', medicalRecordRoutes);
        this.app.use('/api/prescriptions', prescriptionRoutes);
        this.app.use('/api/lab-reports', labReportRoutes);
        this.app.use('/api/symptoms', symptomRoutes);
        this.app.use('/api/referrals', referralRoutes);
        this.app.use('/api/notifications', notificationRoutes);
        this.app.use('/api/teleconsultation', teleconsultationRoutes);
        this.app.use('/api/follow-ups', followUpRoutes);

        // Handle 404 - Not Found
        this.app.all('*', ErrorMiddleware.notFound);
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // Global error handler
        this.app.use(ErrorMiddleware.errorHandler);
    }

    /**
     * Get Express app instance
     */
    getApp() {
        return this.app;
    }
}

module.exports = new App().getApp();
