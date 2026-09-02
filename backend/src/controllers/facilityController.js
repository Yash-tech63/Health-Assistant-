const Facility = require('../models/Facility');
const Doctor = require('../models/Doctor');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Facility Controller
 */
class FacilityController {
    /**
     * @desc    Get all facilities
     * @route   GET /api/facilities
     * @access  Public
     */
    getAllFacilities = asyncHandler(async (req, res, next) => {
        const {
            facilityType,
            city,
            state,
            hasEmergencyServices,
            isVerified,
            page = 1,
            limit = 10,
        } = req.query;

        // Build query
        const query = { isActive: true };

        if (facilityType) {
            query.facilityType = facilityType;
        }

        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }

        if (state) {
            query['address.state'] = { $regex: state, $options: 'i' };
        }

        if (hasEmergencyServices !== undefined) {
            query.emergencyServices = hasEmergencyServices === 'true';
        }

        if (isVerified !== undefined) {
            query.isVerified = isVerified === 'true';
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const facilities = await Facility.find(query)
            .select('-__v')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ name: 1 });

        const total = await Facility.countDocuments(query);

        res.status(200).json({
            success: true,
            data: facilities,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    });

    /**
     * @desc    Get facility by ID
     * @route   GET /api/facilities/:id
     * @access  Public
     */
    getFacilityById = asyncHandler(async (req, res, next) => {
        const facilityId = req.params.id;

        const facility = await Facility.findById(facilityId)
            .select('-__v');

        if (!facility) {
            return next(ApiError.notFound('Facility not found'));
        }

        res.status(200).json({
            success: true,
            data: facility,
        });
    });

    /**
     * @desc    Get nearby facilities
     * @route   GET /api/facilities/nearby
     * @access  Public
     */
    getNearbyFacilities = asyncHandler(async (req, res, next) => {
        const { latitude, longitude, maxDistance = 10000, facilityType } = req.query;

        if (!latitude || !longitude) {
            return next(ApiError.badRequest('Latitude and longitude are required'));
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const distance = parseInt(maxDistance);

        if (isNaN(lat) || isNaN(lng) || isNaN(distance)) {
            return next(ApiError.badRequest('Invalid coordinates or distance'));
        }

        // Build query
        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat],
                    },
                    $maxDistance: distance,
                },
            },
            isActive: true,
            isVerified: true,
        };

        if (facilityType) {
            query.facilityType = facilityType;
        }

        const facilities = await Facility.find(query)
            .select('name facilityType address location services diagnosticFacilities totalBeds availableBeds emergencyServices averageRating totalReviews')
            .limit(20);

        // Calculate distance for each facility
        const facilitiesWithDistance = facilities.map(facility => {
            const facilityData = facility.toObject();

            // Calculate distance (simplified - for production use proper distance calculation)
            if (facilityData.location && facilityData.location.coordinates) {
                const [facLng, facLat] = facilityData.location.coordinates;
                const distance = calculateDistance(lat, lng, facLat, facLng);
                facilityData.distance = distance;
                facilityData.distanceFormatted = formatDistance(distance);
            }

            return facilityData;
        });

        // Sort by distance
        facilitiesWithDistance.sort((a, b) => a.distance - b.distance);

        res.status(200).json({
            success: true,
            data: facilitiesWithDistance,
        });
    });

    /**
     * @desc    Get doctors at facility
     * @route   GET /api/facilities/:id/doctors
     * @access  Public
     */
    getFacilityDoctors = asyncHandler(async (req, res, next) => {
        const facilityId = req.params.id;
        const { specialization, isAvailable, page = 1, limit = 10 } = req.query;

        // Check if facility exists
        const facility = await Facility.findById(facilityId);
        if (!facility) {
            return next(ApiError.notFound('Facility not found'));
        }

        // Build query for doctors
        const query = { facility: facilityId, isVerified: true };

        if (specialization) {
            query.specialization = { $regex: specialization, $options: 'i' };
        }

        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const doctors = await Doctor.find(query)
            .populate('user', 'name phone')
            .select('doctorName specialization qualification experience consultationFee isAvailable availableDays')
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
     * @desc    Get facility services
     * @route   GET /api/facilities/:id/services
     * @access  Public
     */
    getFacilityServices = asyncHandler(async (req, res, next) => {
        const facilityId = req.params.id;

        const facility = await Facility.findById(facilityId)
            .select('name services diagnosticFacilities');

        if (!facility) {
            return next(ApiError.notFound('Facility not found'));
        }

        res.status(200).json({
            success: true,
            data: {
                services: facility.services,
                diagnosticFacilities: facility.diagnosticFacilities,
            },
        });
    });

    /**
     * @desc    Create new facility (Admin only)
     * @route   POST /api/facilities
     * @access  Private (Admin only)
     */
    createFacility = asyncHandler(async (req, res, next) => {
        const facilityData = req.body;

        // Check if facility already exists with same registration number
        if (facilityData.registrationNumber) {
            const existingFacility = await Facility.findOne({
                registrationNumber: facilityData.registrationNumber,
            });

            if (existingFacility) {
                return next(ApiError.conflict('Facility with this registration number already exists'));
            }
        }

        // Create facility
        const facility = await Facility.create(facilityData);

        res.status(201).json({
            success: true,
            message: 'Facility created successfully',
            data: facility,
        });
    });

    /**
     * @desc    Update facility (Admin only)
     * @route   PUT /api/facilities/:id
     * @access  Private (Admin only)
     */
    updateFacility = asyncHandler(async (req, res, next) => {
        const facilityId = req.params.id;
        const updateData = req.body;

        const facility = await Facility.findByIdAndUpdate(
            facilityId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!facility) {
            return next(ApiError.notFound('Facility not found'));
        }

        res.status(200).json({
            success: true,
            message: 'Facility updated successfully',
            data: facility,
        });
    });

    /**
     * @desc    Delete facility (Admin only)
     * @route   DELETE /api/facilities/:id
     * @access  Private (Admin only)
     */
    deleteFacility = asyncHandler(async (req, res, next) => {
        const facilityId = req.params.id;

        const facility = await Facility.findById(facilityId);
        if (!facility) {
            return next(ApiError.notFound('Facility not found'));
        }

        // Soft delete - mark as inactive
        facility.isActive = false;
        await facility.save();

        res.status(200).json({
            success: true,
            message: 'Facility deleted successfully',
        });
    });

    /**
     * @desc    Verify facility (Admin only)
     * @route   PUT /api/facilities/:id/verify
     * @access  Private (Admin only)
     */
    verifyFacility = asyncHandler(async (req, res, next) => {
        const facilityId = req.params.id;
        const { notes } = req.body;

        const facility = await Facility.findById(facilityId);
        if (!facility) {
            return next(ApiError.notFound('Facility not found'));
        }

        facility.verifyFacility(notes || '');

        res.status(200).json({
            success: true,
            message: 'Facility verified successfully',
            data: facility,
        });
    });

    /**
     * @desc    Update facility status (Admin only)
     * @route   PUT /api/facilities/:id/status
     * @access  Private (Admin only)
     */
    updateFacilityStatus = asyncHandler(async (req, res, next) => {
        const facilityId = req.params.id;
        const { isActive, isVerified } = req.body;

        const facility = await Facility.findById(facilityId);
        if (!facility) {
            return next(ApiError.notFound('Facility not found'));
        }

        if (isActive !== undefined) {
            facility.isActive = isActive;
        }

        if (isVerified !== undefined) {
            facility.isVerified = isVerified;
        }

        await facility.save();

        res.status(200).json({
            success: true,
            message: 'Facility status updated successfully',
            data: facility,
        });
    });

    /**
     * @desc    Get facility statistics
     * @route   GET /api/facilities/statistics
     * @access  Private (Admin, Health Worker)
     */
    getFacilityStatistics = asyncHandler(async (req, res, next) => {
        const stats = await Facility.getStatistics();

        res.status(200).json({
            success: true,
            data: stats,
        });
    });

    /**
     * @desc    Search facilities by name or city
     * @route   GET /api/facilities/search
     * @access  Public
     */
    searchFacilities = asyncHandler(async (req, res, next) => {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return next(ApiError.badRequest('Search query is required'));
        }

        const query = {
            $text: { $search: q },
            isActive: true,
            isVerified: true,
        };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const facilities = await Facility.find(query)
            .select('name facilityType address averageRating totalReviews')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ score: { $meta: 'textScore' } });

        const total = await Facility.countDocuments(query);

        res.status(200).json({
            success: true,
            data: facilities,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    });

    /**
     * @desc    Check if facility is open
     * @route   GET /api/facilities/:id/is-open
     * @access  Public
     */
    checkIfFacilityIsOpen = asyncHandler(async (req, res, next) => {
        const facilityId = req.params.id;

        const facility = await Facility.findById(facilityId)
            .select('name operatingHours emergencyServices');

        if (!facility) {
            return next(ApiError.notFound('Facility not found'));
        }

        const isOpen = facility.isOpen();

        res.status(200).json({
            success: true,
            data: {
                facilityName: facility.name,
                isOpen,
                emergencyServices: facility.emergencyServices,
                currentTime: new Date().toISOString(),
            },
        });
    });

    /**
     * @desc    Get facilities by type
     * @route   GET /api/facilities/type/:type
     * @access  Public
     */
    getFacilitiesByType = asyncHandler(async (req, res, next) => {
        const facilityType = req.params.type;

        const facilities = await Facility.find({
            facilityType: facilityType,
            isActive: true,
            isVerified: true,
        })
            .select('name address city state averageRating totalReviews totalBeds availableBeds')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: facilities,
        });
    });
}

// Helper functions for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

function formatDistance(distanceKm) {
    if (distanceKm < 1) {
        const distanceM = Math.round(distanceKm * 1000);
        return `${distanceM} m`;
    } else if (distanceKm < 10) {
        return `${distanceKm.toFixed(1)} km`;
    } else {
        return `${Math.round(distanceKm)} km`;
    }
}

module.exports = new FacilityController();