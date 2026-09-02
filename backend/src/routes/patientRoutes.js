const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const AuthMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

/**
 * @route   GET /api/patients/me
 * @desc    Get current patient profile
 * @access  Private (Patient only)
 */
router.get('/me',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.getMyProfile
);

/**
 * @route   PUT /api/patients/me
 * @desc    Update current patient profile
 * @access  Private (Patient only)
 */
router.put('/me',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.updateMyProfile
);

/**
 * @route   PUT /api/patients/me/health-info
 * @desc    Update patient health information
 * @access  Private (Patient only)
 */
router.put('/me/health-info',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.updateHealthInfo
);

/**
 * @route   POST /api/patients/me/allergies
 * @desc    Add allergy
 * @access  Private (Patient only)
 */
router.post('/me/allergies',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.addAllergy
);

/**
 * @route   POST /api/patients/me/chronic-diseases
 * @desc    Add chronic disease
 * @access  Private (Patient only)
 */
router.post('/me/chronic-diseases',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.addChronicDisease
);

/**
 * @route   POST /api/patients/me/medications
 * @desc    Add current medication
 * @access  Private (Patient only)
 */
router.post('/me/medications',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.addMedication
);

/**
 * @route   PUT /api/patients/me/emergency-contact
 * @desc    Update patient emergency contact
 * @access  Private (Patient only)
 */
router.put('/me/emergency-contact',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.updateEmergencyContact
);

/**
 * @route   PUT /api/patients/me/consent
 * @desc    Update patient consent
 * @access  Private (Patient only)
 */
router.put('/me/consent',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.updateConsent
);

/**
 * @route   GET /api/patients/me/summary
 * @desc    Get patient's medical summary
 * @access  Private (Patient only)
 */
router.get('/me/summary',
    AuthMiddleware.authorizeRoles('patient'),
    patientController.getMedicalSummary
);

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID (for doctors/health workers)
 * @access  Private (Doctor, Health Worker, Admin)
 */
/**
 * @route   GET /api/patients/high-risk
 * @desc    Get high-risk patients
 * @access  Private (Doctor, Health Worker, Admin)
 */
router.get('/high-risk',
    AuthMiddleware.authorizeRoles('doctor', 'health_worker', 'admin'),
    patientController.getHighRiskPatients
);

/**
 * @route   GET /api/patients/statistics
 * @desc    Get patient statistics
 * @access  Private (Admin, Health Worker)
 */
router.get('/statistics',
    AuthMiddleware.authorizeRoles('admin', 'health_worker'),
    patientController.getStatistics
);

router.get('/:id',
    AuthMiddleware.authorizeRoles('doctor', 'health_worker', 'admin'),
    patientController.getPatientById
);

router.get('/',
    AuthMiddleware.authorizeRoles('doctor', 'health_worker', 'admin'),
    patientController.searchPatients
);

module.exports = router;
