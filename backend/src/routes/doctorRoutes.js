const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const AuthMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors
 * @access  Public
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @route   GET /api/doctors/search
 * @desc    Search doctors
 * @access  Public
 */
router.get('/search', doctorController.searchDoctors);

/**
 * @route   GET /api/doctors/specialization/:specialization
 * @desc    Get doctors by specialization
 * @access  Public
 */
router.get('/specialization/:specialization', doctorController.getDoctorsBySpecialization);

/**
 * @route   GET /api/doctors/:id
 * @desc    Get doctor by ID
 * @access  Public
 */
router.get('/:id/availability', doctorController.getDoctorAvailability);

/** @route GET /api/doctors/:id @access Public */
router.get('/:id', doctorController.getDoctorById);

// Admin routes - require authentication and admin role
router.use(AuthMiddleware.verifyToken);

/**
 * @route   POST /api/doctors
 * @desc    Create doctor (Admin only)
 * @access  Private (Admin only)
 */
router.post('/',
    AuthMiddleware.authorizeRoles('admin'),
    doctorController.createDoctor
);

/**
 * @route   PUT /api/doctors/:id
 * @desc    Update doctor (Admin only)
 * @access  Private (Admin only)
 */
router.put('/:id',
    AuthMiddleware.authorizeRoles('admin'),
    doctorController.updateDoctor
);

/**
 * @route   DELETE /api/doctors/:id
 * @desc    Delete doctor (Admin only)
 * @access  Private (Admin only)
 */
router.delete('/:id',
    AuthMiddleware.authorizeRoles('admin'),
    doctorController.deleteDoctor
);

/**
 * @route   GET /api/doctors/statistics
 * @desc    Get doctor statistics
 * @access  Private (Admin, Health Worker)
 */
router.get('/statistics',
    AuthMiddleware.authorizeRoles('admin', 'health_worker'),
    doctorController.getDoctorStatistics
);

/**
 * @route   PUT /api/doctors/:id/queue-status
 * @desc    Update doctor's queue status
 * @access  Private (Doctor only)
 */
router.put('/:id/queue-status',
    AuthMiddleware.authorizeRoles('doctor'),
    doctorController.updateQueueStatus
);

module.exports = router;
