const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const AuthMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/facilities
 * @desc    Get all facilities
 * @access  Public
 */
router.get('/', facilityController.getAllFacilities);

/**
 * @route   GET /api/facilities/nearby
 * @desc    Get nearby facilities
 * @access  Public
 */
router.get('/nearby', facilityController.getNearbyFacilities);

/**
 * @route   GET /api/facilities/search
 * @desc    Search facilities by name or city
 * @access  Public
 */
router.get('/search', facilityController.searchFacilities);

/**
 * @route   GET /api/facilities/type/:type
 * @desc    Get facilities by type
 * @access  Public
 */
router.get('/type/:type', facilityController.getFacilitiesByType);

/**
 * @route   GET /api/facilities/:id
 * @desc    Get facility by ID
 * @access  Public
 */
router.get('/:id/is-open', facilityController.checkIfFacilityIsOpen);

/**
 * @route   GET /api/facilities/:id/doctors
 * @desc    Get doctors at facility
 * @access  Public
 */
router.get('/:id/doctors', facilityController.getFacilityDoctors);

/**
 * @route   GET /api/facilities/:id/services
 * @desc    Get facility services
 * @access  Public
 */
router.get('/:id/services', facilityController.getFacilityServices);

router.get('/:id/diagnostics', facilityController.getFacilityServices);

/** @route GET /api/facilities/:id @access Public */
router.get('/:id', facilityController.getFacilityById);

// Admin routes - require authentication and admin role
router.use(AuthMiddleware.verifyToken, AuthMiddleware.authorizeRoles('admin'));

/**
 * @route   POST /api/facilities
 * @desc    Create new facility (Admin only)
 * @access  Private (Admin only)
 */
router.post('/', facilityController.createFacility);

/**
 * @route   PUT /api/facilities/:id
 * @desc    Update facility (Admin only)
 * @access  Private (Admin only)
 */
router.put('/:id', facilityController.updateFacility);

/**
 * @route   DELETE /api/facilities/:id
 * @desc    Delete facility (Admin only)
 * @access  Private (Admin only)
 */
router.delete('/:id', facilityController.deleteFacility);

/**
 * @route   PUT /api/facilities/:id/verify
 * @desc    Verify facility (Admin only)
 * @access  Private (Admin only)
 */
router.put('/:id/verify', facilityController.verifyFacility);

/**
 * @route   PUT /api/facilities/:id/status
 * @desc    Update facility status (Admin only)
 * @access  Private (Admin only)
 */
router.put('/:id/status', facilityController.updateFacilityStatus);

/**
 * @route   GET /api/facilities/statistics
 * @desc    Get facility statistics
 * @access  Private (Admin, Health Worker)
 */
router.get('/statistics',
    AuthMiddleware.authorizeRoles('admin', 'health_worker'),
    facilityController.getFacilityStatistics
);

module.exports = router;
