const Patient = require('../models/Patient');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Patient Controller
 */
class PatientController {
    /**
     * @desc    Get current patient profile
     * @route   GET /api/patients/me
     * @access  Private (Patient only)
     */
    getMyProfile = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;

        // Find patient by user ID
        const patient = await Patient.findOne({ user: userId })
            .populate('user', 'fullName phone email role isPhoneVerified')
            .select('-__v');

        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    });

    /**
     * @desc    Update current patient profile
     * @route   PUT /api/patients/me
     * @access  Private (Patient only)
     */
    updateMyProfile = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const updateData = req.body;

        // Fields that can be updated by patient
        const allowedFields = [
            'fullName',
            'dateOfBirth',
            'gender',
            'bloodGroup',
            'address',
            'emergencyContact',
            'preferredLanguage',
            'preferredCommunication',
        ];

        // Filter update data
        const filteredUpdate = {};
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredUpdate[key] = updateData[key];
            }
        });

        // Update patient
        const patient = await Patient.findOneAndUpdate(
            { user: userId },
            filteredUpdate,
            { new: true, runValidators: true }
        ).populate('user', 'fullName phone email');

        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: patient,
        });
    });

    /**
     * @desc    Update patient health information
     * @route   PUT /api/patients/me/health-info
     * @access  Private (Patient only)
     */
    updateHealthInfo = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const healthData = req.body;

        // Fields that can be updated in health info
        const allowedFields = [
            'basicHealthInformation',
            'allergies',
            'chronicDiseases',
            'currentMedications',
        ];

        // Filter health data
        const filteredHealthData = {};
        Object.keys(healthData).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredHealthData[key] = healthData[key];
            }
        });

        // Find patient
        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        // Update health information
        if (filteredHealthData.basicHealthInformation) {
            patient.basicHealthInformation = {
                ...patient.basicHealthInformation,
                ...filteredHealthData.basicHealthInformation,
                lastUpdated: Date.now(),
            };
        }

        if (filteredHealthData.allergies) {
            patient.allergies = filteredHealthData.allergies;
        }

        if (filteredHealthData.chronicDiseases) {
            patient.chronicDiseases = filteredHealthData.chronicDiseases;
        }

        if (filteredHealthData.currentMedications) {
            patient.currentMedications = filteredHealthData.currentMedications;
        }

        await patient.save();

        res.status(200).json({
            success: true,
            message: 'Health information updated successfully',
            data: {
                basicHealthInformation: patient.basicHealthInformation,
                allergies: patient.allergies,
                chronicDiseases: patient.chronicDiseases,
                currentMedications: patient.currentMedications,
            },
        });
    });

    /**
     * @desc    Add allergy
     * @route   POST /api/patients/me/allergies
     * @access  Private (Patient only)
     */
    addAllergy = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const allergyData = req.body;

        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        patient.addAllergy(allergyData);

        res.status(200).json({
            success: true,
            message: 'Allergy added successfully',
            data: patient.allergies,
        });
    });

    /**
     * @desc    Add chronic disease
     * @route   POST /api/patients/me/chronic-diseases
     * @access  Private (Patient only)
     */
    addChronicDisease = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const diseaseData = req.body;

        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        patient.addChronicDisease(diseaseData);

        res.status(200).json({
            success: true,
            message: 'Chronic disease added successfully',
            data: patient.chronicDiseases,
        });
    });

    /**
     * @desc    Add current medication
     * @route   POST /api/patients/me/medications
     * @access  Private (Patient only)
     */
    addMedication = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const medicationData = req.body;

        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        patient.addMedication(medicationData);

        res.status(200).json({
            success: true,
            message: 'Medication added successfully',
            data: patient.currentMedications,
        });
    });

    /**
     * @desc    Get patient by ID (for doctors/health workers)
     * @route   GET /api/patients/:id
     * @access  Private (Doctor, Health Worker, Admin)
     */
    getPatientById = asyncHandler(async (req, res, next) => {
        const patientId = req.params.id;

        const patient = await Patient.findById(patientId)
            .populate('user', 'name phone email role')
            .select('-__v');

        if (!patient) {
            return next(ApiError.notFound('Patient not found'));
        }

        // Authorization check
        const user = req.user;
        if (user.role === 'patient' && patient.user._id.toString() !== user._id.toString()) {
            return next(ApiError.forbidden('Access denied'));
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    });

    /**
     * @desc    Search patients
     * @route   GET /api/patients
     * @access  Private (Doctor, Health Worker, Admin)
     */
    searchPatients = asyncHandler(async (req, res, next) => {
        const {
            search,
            bloodGroup,
            isHighRisk,
            city,
            gender,
            page = 1,
            limit = 10,
        } = req.query;

        // Build query
        const query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (bloodGroup) {
            query.bloodGroup = bloodGroup;
        }

        if (isHighRisk !== undefined) {
            query.isHighRisk = isHighRisk === 'true';
        }

        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }

        if (gender) {
            query.gender = gender;
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const patients = await Patient.find(query)
            .populate('user', 'name phone email')
            .select('-__v')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Patient.countDocuments(query);

        res.status(200).json({
            success: true,
            data: patients,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    });

    /**
     * @desc    Get high-risk patients
     * @route   GET /api/patients/high-risk
     * @access  Private (Doctor, Health Worker, Admin)
     */
    getHighRiskPatients = asyncHandler(async (req, res, next) => {
        const patients = await Patient.find({ isHighRisk: true })
            .populate('user', 'name phone email')
            .select('fullName dateOfBirth gender bloodGroup highRiskReason highRiskSince')
            .sort({ highRiskSince: -1 });

        res.status(200).json({
            success: true,
            data: patients,
        });
    });

    /**
     * @desc    Get patient statistics
     * @route   GET /api/patients/statistics
     * @access  Private (Admin, Health Worker)
     */
    getStatistics = asyncHandler(async (req, res, next) => {
        const stats = await Patient.getStatistics();

        res.status(200).json({
            success: true,
            data: stats,
        });
    });

    /**
     * @desc    Update patient emergency contact
     * @route   PUT /api/patients/me/emergency-contact
     * @access  Private (Patient only)
     */
    updateEmergencyContact = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const emergencyContact = req.body;

        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        patient.emergencyContact = emergencyContact;
        await patient.save();

        res.status(200).json({
            success: true,
            message: 'Emergency contact updated successfully',
            data: patient.emergencyContact,
        });
    });

    /**
     * @desc    Update patient consent
     * @route   PUT /api/patients/me/consent
     * @access  Private (Patient only)
     */
    updateConsent = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;
        const { consentToShareData, consentToResearch, consentToEmergencyContact } = req.body;

        const patient = await Patient.findOne({ user: userId });
        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        if (consentToShareData !== undefined) {
            patient.consentToShareData = consentToShareData;
        }

        if (consentToResearch !== undefined) {
            patient.consentToResearch = consentToResearch;
        }

        if (consentToEmergencyContact !== undefined) {
            patient.consentToEmergencyContact = consentToEmergencyContact;
        }

        await patient.save();

        res.status(200).json({
            success: true,
            message: 'Consent preferences updated successfully',
            data: {
                consentToShareData: patient.consentToShareData,
                consentToResearch: patient.consentToResearch,
                consentToEmergencyContact: patient.consentToEmergencyContact,
            },
        });
    });

    /**
     * @desc    Get patient's medical summary
     * @route   GET /api/patients/me/summary
     * @access  Private (Patient only)
     */
    getMedicalSummary = asyncHandler(async (req, res, next) => {
        const userId = req.user._id;

        const patient = await Patient.findOne({ user: userId })
            .select('bloodGroup allergies chronicDiseases currentMedications basicHealthInformation isHighRisk');

        if (!patient) {
            return next(ApiError.notFound('Patient profile not found'));
        }

        const summary = {
            bloodGroup: patient.bloodGroup,
            allergies: patient.allergies.map(a => ({
                allergen: a.allergen,
                severity: a.severity,
            })),
            chronicDiseases: patient.chronicDiseases.map(d => ({
                disease: d.disease,
                status: d.status,
            })),
            currentMedications: patient.currentMedications.map(m => ({
                medicineName: m.medicineName,
                dosage: m.dosage,
                frequency: m.frequency,
            })),
            vitalSigns: patient.basicHealthInformation,
            isHighRisk: patient.isHighRisk,
            highRiskReason: patient.highRiskReason,
            lastUpdated: patient.basicHealthInformation?.lastUpdated,
        };

        res.status(200).json({
            success: true,
            data: summary,
        });
    });
}

module.exports = new PatientController();