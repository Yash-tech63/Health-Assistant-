const Doctor = require('../models/Doctor');
const Facility = require('../models/Facility');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Doctor Controller
 */
class DoctorController {
    /**
     * @desc    Get all doctors
     * @route   GET /api/doctors
     * @access  Public
     */
    getAllDoctors = asyncHandler(async (req, res, next) => {
        const {
            specialization,
            facility,
            isAvailable,
            city,
            page = 1,
            limit = 10,
        } = req.query;

        // Build query
        const query = { isVerified: true };

        if (specialization) {
            query.specialization = { $regex: specialization, $options: 'i' };
        }

        if (facility) {
            query.facility = facility;
        }

        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        if (city) {
            // Find facilities in city, then find doctors at those facilities
            const facilitiesInCity = await Facility.find({
                'address.city': { $regex: city, $options: 'i' },
                isActive: true,
            }).select('_id');

            const facilityIds = facilitiesInCity.map(f => f._id);
            query.facility = { $in: facilityIds };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const doctors = await Doctor.find(query)
            .populate('user', 'name phone email')
            .populate('facility', 'name facilityType address city state')
            .select('-__v')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ doctorName: 1 });

        const total = await Doctor.countDocuments(query);

        res.status(200).json({
            success: true,
            data: doctors,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    });

    /**
     * @desc    Get doctor by ID
     * @route   GET /api/doctors/:id
     * @access  Public
     */
    getDoctorById = asyncHandler(async (req, res, next) => {
        const doctorId = req.params.id;

        const doctor = await Doctor.findById(doctorId)
            .populate('user', 'name phone email')
            .populate('facility', 'name facilityType address services diagnosticFacilities')
            .select('-__v');

        if (!doctor) {
            return next(ApiError.notFound('Doctor not found'));
        }

        res.status(200).json({
            success: true,
            data: doctor,
        });
    });

    /**
     * @desc    Get doctor's availability
     * @route   GET /api/doctors/:id/availability
     * @access  Public
     */
    getDoctorAvailability = asyncHandler(async (req, res, next) => {
        const doctorId = req.params.id;
        const { date } = req.query;

        const doctor = await Doctor.findById(doctorId)
            .select('doctorName specialization availableDays availableSlots isAvailable consultationFee');

        if (!doctor) {
            return next(ApiError.notFound('Doctor not found'));
        }

        // TODO: Check existing appointments for the date
        // This would require Appointment model integration

        const availability = {
            doctorName: doctor.doctorName,
            specialization: doctor.specialization,
            isAvailable: doctor.isAvailable,
            availableDays: doctor.availableDays,
            availableSlots: doctor.availableSlots,
            consultationFee: doctor.consultationFee,
            // Add slot availability based on date
            date: date || new Date().toISOString().split('T')[0],
            message: doctor.isAvailable ? 'Doctor is available for consultations' : 'Doctor is currently unavailable',
        };

        res.status(200).json({
            success: true,
            data: availability,
        });
    });

    /**
     * @desc    Create doctor (Admin only)
     * @route   POST /api/doctors
     * @access  Private (Admin only)
     */
    createDoctor = asyncHandler(async (req, res, next) => {
        const doctorData = req.body;

        // Check if doctor already exists with same user
        if (doctorData.user) {
            const existingDoctor = await Doctor.findOne({ user: doctorData.user });
            if (existingDoctor) {
                return next(ApiError.conflict('Doctor already exists for this user'));
            }
        }

        // Create doctor
        const doctor = await Doctor.create(doctorData);

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: doctor,
        });
    });

    /**
     * @desc    Update doctor (Admin only)
     * @route   PUT /api/doctors/:id
     * @access  Private (Admin only)
     */
    updateDoctor = asyncHandler(async (req, res, next) => {
        const doctorId = req.params.id;
        const updateData = req.body;

        const doctor = await Doctor.findByIdAndUpdate(
            doctorId,
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'name phone email');

        if (!doctor) {
            return next(ApiError.notFound('Doctor not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: doctor,
        });
    });

    /**
     * @desc    Delete doctor (Admin only)
     * @route   DELETE /api/doctors/:id
     * @access  Private (Admin only)
     */
    deleteDoctor = asyncHandler(async (req, res, next) => {
        const doctorId = req.params.id;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return next(ApiError.notFound('Doctor not found'));
        }

        // Soft delete - mark as inactive
        doctor.isAvailable = false;
        // In production, you might want to mark as deleted instead
        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Doctor marked as unavailable',
        });
    });

    /**
     * @desc    Get doctor statistics
     * @route   GET /api/doctors/statistics
     * @access  Private (Admin, Health Worker)
     */
    getDoctorStatistics = asyncHandler(async (req, res, next) => {
        const stats = await Doctor.getStatistics();

        res.status(200).json({
            success: true,
            data: stats,
        });
    });

    /**
     * @desc    Search doctors
     * @route   GET /api/doctors/search
     * @access  Public
     */
    searchDoctors = asyncHandler(async (req, res, next) => {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return next(ApiError.badRequest('Search query is required'));
        }

        const query = {
            $text: { $search: q },
            isVerified: true,
        };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const doctors = await Doctor.find(query)
            .populate('user', 'name phone')
            .populate('facility', 'name facilityType address city')
            .select('doctorName specialization experience consultationFee isAvailable')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ score: { $meta: 'textScore' } });

        const total = await Doctor.countDocuments(query);

        res.status(200).json({
            success: true,
            data: doctors,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    });

    /**
     * @desc    Get doctors by specialization
     * @route   GET /api/doctors/specialization/:specialization
     * @access  Public
     */
    getDoctorsBySpecialization = asyncHandler(async (req, res, next) => {
        const specialization = req.params.specialization;

        const doctors = await Doctor.find({
            specialization: { $regex: specialization, $options: 'i' },
            isVerified: true,
            isAvailable: true,
        })
            .populate('user', 'name phone')
            .populate('facility', 'name facilityType address city')
            .select('doctorName specialization experience consultationFee')
            .sort({ experience: -1 });

        res.status(200).json({
            success: true,
            data: doctors,
        });
    });

    /**
     * @desc    Update doctor's queue status
     * @route   PUT /api/doctors/:id/queue-status
     * @access  Private (Doctor only)
     */
    updateQueueStatus = asyncHandler(async (req, res, next) => {
        const doctorId = req.params.id;
        const { currentToken, patientsInQueue, estimatedWaitingTime } = req.body;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return next(ApiError.notFound('Doctor not found'));
        }

        // Authorization check - doctor can only update their own status
        if (req.user._id.toString() !== doctor.user.toString() && req.user.role !== 'admin') {
            return next(ApiError.forbidden('Not authorized to update this doctor'));
        }

        if (currentToken !== undefined) {
            doctor.currentToken = currentToken;
        }

        if (patientsInQueue !== undefined) {
            doctor.patientsInQueue = patientsInQueue;
        }

        if (estimatedWaitingTime !== undefined) {
            doctor.estimatedWaitingTime = estimatedWaitingTime;
        }

        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Queue status updated successfully',
            data: {
                currentToken: doctor.currentToken,
                patientsInQueue: doctor.patientsInQueue,
                estimatedWaitingTime: doctor.estimatedWaitingTime,
            },
        });
    });
}

module.exports = new DoctorController();