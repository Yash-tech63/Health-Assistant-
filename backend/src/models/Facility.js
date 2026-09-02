const mongoose = require('mongoose');

/**
 * Facility Schema
 */
const facilitySchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Facility name is required'],
        trim: true,
        minlength: [2, 'Facility name must be at least 2 characters'],
        maxlength: [200, 'Facility name cannot exceed 200 characters'],
    },

    facilityType: {
        type: String,
        required: [true, 'Facility type is required'],
        enum: ['PHC', 'CHC', 'District Hospital', 'Private Hospital', 'Clinic', 'Diagnostic Center', 'Nursing Home'],
    },

    registrationNumber: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },

    // Contact Information
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^\+?[1-9]\d{9,14}$/.test(v);
            },
            message: 'Please enter a valid phone number',
        },
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address',
        },
    },

    // Address Information
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            trim: true,
            validate: {
                validator: function (v) {
                    return /^\d{6}$/.test(v);
                },
                message: 'Please enter a valid 6-digit pincode',
            },
        },
        country: {
            type: String,
            default: 'India',
        },
    },

    // GeoJSON Location for spatial queries
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: function (v) {
                    return Array.isArray(v) && v.length === 2 &&
                        v[0] >= -180 && v[0] <= 180 && // longitude
                        v[1] >= -90 && v[1] <= 90;     // latitude
                },
                message: 'Invalid coordinates',
            },
        },
    },

    // Facility Details
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    services: [{
        name: {
            type: String,
            required: true,
            trim: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
        timing: {
            start: String, // Format: "HH:mm"
            end: String,   // Format: "HH:mm"
        },
        cost: {
            type: Number,
            min: [0, 'Cost cannot be negative'],
        },
    }],

    diagnosticFacilities: [{
        name: {
            type: String,
            required: true,
            trim: true,
        },
        testType: String,
        available: {
            type: Boolean,
            default: true,
        },
        timing: {
            start: String, // Format: "HH:mm"
            end: String,   // Format: "HH:mm"
        },
        cost: {
            type: Number,
            min: [0, 'Cost cannot be negative'],
        },
        reportTime: {
            type: String, // e.g., "2 hours", "24 hours", "Same day"
        },
    }],

    // Capacity Information
    totalBeds: {
        type: Number,
        default: 0,
        min: [0, 'Total beds cannot be negative'],
    },

    availableBeds: {
        type: Number,
        default: 0,
        min: [0, 'Available beds cannot be negative'],
    },

    icuBeds: {
        type: Number,
        default: 0,
        min: [0, 'ICU beds cannot be negative'],
    },

    operationTheaters: {
        type: Number,
        default: 0,
        min: [0, 'Operation theaters cannot be negative'],
    },

    // Staff Information
    totalDoctors: {
        type: Number,
        default: 0,
        min: [0, 'Total doctors cannot be negative'],
    },

    totalNurses: {
        type: Number,
        default: 0,
        min: [0, 'Total nurses cannot be negative'],
    },

    totalStaff: {
        type: Number,
        default: 0,
        min: [0, 'Total staff cannot be negative'],
    },

    // Operating Hours
    operatingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String },
    },

    emergencyServices: {
        type: Boolean,
        default: false,
    },

    emergencyContact: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^\+?[1-9]\d{9,14}$/.test(v);
            },
            message: 'Please enter a valid emergency contact number',
        },
    },

    // Facility Status
    isActive: {
        type: Boolean,
        default: true,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    verificationNotes: String,

    // Amenities
    amenities: [{
        type: String,
        enum: [
            'wheelchair_access',
            'parking',
            'pharmacy',
            'cafeteria',
            'wifi',
            'ac',
            'atm',
            'ambulance',
            'laboratory',
            'xray',
            'ultrasound',
            'ecg',
            'blood_bank',
        ],
    }],

    // Images
    images: [{
        url: String,
        caption: String,
        isPrimary: {
            type: Boolean,
            default: false,
        },
    }],

    // Rating and Reviews
    averageRating: {
        type: Number,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot exceed 5'],
        default: 0,
    },

    totalReviews: {
        type: Number,
        default: 0,
    },

    // Statistics
    totalPatients: {
        type: Number,
        default: 0,
    },

    monthlyAveragePatients: {
        type: Number,
        default: 0,
    },

    // Ownership Details
    ownerName: String,

    ownerContact: String,

    // Government Specific (for PHC/CHC/District Hospital)
    governmentId: String,

    nodalOfficer: {
        name: String,
        contact: String,
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

/**
 * Virtual for bed occupancy rate
 */
facilitySchema.virtual('bedOccupancyRate').get(function () {
    if (this.totalBeds === 0) return 0;
    return ((this.totalBeds - this.availableBeds) / this.totalBeds) * 100;
});

/**
 * Virtual for facility status
 */
facilitySchema.virtual('status').get(function () {
    if (!this.isActive) return 'inactive';
    if (!this.isVerified) return 'pending_verification';
    return 'active';
});

/**
 * Virtual for facility contact info
 */
facilitySchema.virtual('contactInfo').get(function () {
    return {
        phone: this.phone,
        email: this.email,
        emergencyContact: this.emergencyContact,
        address: this.address,
    };
});

/**
 * Indexes
 */
facilitySchema.index({ location: '2dsphere' });
facilitySchema.index({ name: 'text', description: 'text', 'address.city': 'text', 'address.state': 'text' });
facilitySchema.index({ facilityType: 1 });
facilitySchema.index({ 'address.city': 1, 'address.state': 1 });
facilitySchema.index({ isActive: 1, isVerified: 1 });
facilitySchema.index({ registrationNumber: 1 }, { sparse: true });
facilitySchema.index({ createdAt: -1 });

/**
 * Pre-save middleware
 */
facilitySchema.pre('save', function (next) {
    // Update updatedAt timestamp
    this.updatedAt = Date.now();

    // Ensure coordinates are numbers
    if (this.location.coordinates && Array.isArray(this.location.coordinates)) {
        this.location.coordinates = this.location.coordinates.map(coord => parseFloat(coord));
    }

    // Calculate available beds if not set
    if (this.totalBeds > 0 && this.availableBeds === undefined) {
        this.availableBeds = this.totalBeds;
    }

    next();
});

/**
 * Method to update location
 */
facilitySchema.methods.updateLocation = function (latitude, longitude) {
    this.location.coordinates = [longitude, latitude];
    return this.save();
};

/**
 * Method to add service
 */
facilitySchema.methods.addService = function (serviceData) {
    this.services.push(serviceData);
    return this.save();
};

/**
 * Method to add diagnostic facility
 */
facilitySchema.methods.addDiagnosticFacility = function (diagnosticData) {
    this.diagnosticFacilities.push(diagnosticData);
    return this.save();
};

/**
 * Method to update bed availability
 */
facilitySchema.methods.updateBedAvailability = function (availableBeds) {
    if (availableBeds < 0 || availableBeds > this.totalBeds) {
        throw new Error('Available beds must be between 0 and total beds');
    }

    this.availableBeds = availableBeds;
    return this.save();
};

/**
 * Method to update staff counts
 */
facilitySchema.methods.updateStaffCounts = function (doctors, nurses, otherStaff) {
    this.totalDoctors = doctors || this.totalDoctors;
    this.totalNurses = nurses || this.totalNurses;
    this.totalStaff = (doctors || 0) + (nurses || 0) + (otherStaff || 0);
    return this.save();
};

/**
 * Method to update rating
 */
facilitySchema.methods.updateRating = function (newRating) {
    const totalScore = this.averageRating * this.totalReviews;
    this.totalReviews += 1;
    this.averageRating = (totalScore + newRating) / this.totalReviews;
    return this.save();
};

/**
 * Method to verify facility
 */
facilitySchema.methods.verifyFacility = function (notes = '') {
    this.isVerified = true;
    this.verificationNotes = notes;
    return this.save();
};

/**
 * Method to check if facility is open
 */
facilitySchema.methods.isOpen = function () {
    const now = new Date();
    const day = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = this.operatingHours[day];

    if (!hours || !hours.open || !hours.close) {
        return false;
    }

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMinute] = hours.open.split(':').map(Number);
    const [closeHour, closeMinute] = hours.close.split(':').map(Number);

    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    return currentTime >= openTime && currentTime <= closeTime;
};

/**
 * Static method to find nearby facilities
 */
facilitySchema.statics.findNearby = function (longitude, latitude, maxDistance = 10000) {
    return this.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                },
                $maxDistance: maxDistance,
            },
        },
        isActive: true,
        isVerified: true,
    })
        .select('name facilityType address location services diagnosticFacilities totalBeds availableBeds averageRating')
        .limit(20);
};

/**
 * Static method to find by facility type
 */
facilitySchema.statics.findByType = function (facilityType) {
    return this.find({
        facilityType: facilityType,
        isActive: true,
        isVerified: true,
    })
        .sort({ name: 1 });
};

/**
 * Static method to find by city
 */
facilitySchema.statics.findByCity = function (city) {
    return this.find({
        'address.city': { $regex: city, $options: 'i' },
        isActive: true,
        isVerified: true,
    })
        .sort({ name: 1 });
};

/**
 * Static method to get facility statistics
 */
facilitySchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                active: {
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
                },
                verified: {
                    $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] },
                },
                totalBeds: { $sum: '$totalBeds' },
                availableBeds: { $sum: '$availableBeds' },
                totalDoctors: { $sum: '$totalDoctors' },
                totalNurses: { $sum: '$totalNurses' },
                avgRating: { $avg: '$averageRating' },
            },
        },
        {
            $project: {
                _id: 0,
                total: 1,
                active: 1,
                verified: 1,
                totalBeds: 1,
                availableBeds: 1,
                bedOccupancyRate: {
                    $cond: [
                        { $eq: ['$totalBeds', 0] },
                        0,
                        { $multiply: [{ $divide: [{ $subtract: ['$totalBeds', '$availableBeds'] }, '$totalBeds'] }, 100] },
                    ],
                },
                totalDoctors: 1,
                totalNurses: 1,
                avgRating: { $round: ['$avgRating', 2] },
            },
        },
    ]);

    const typeStats = await this.aggregate([
        {
            $group: {
                _id: '$facilityType',
                count: { $sum: 1 },
                totalBeds: { $sum: '$totalBeds' },
                totalDoctors: { $sum: '$totalDoctors' },
                avgRating: { $avg: '$averageRating' },
            },
        },
        {
            $project: {
                facilityType: '$_id',
                count: 1,
                totalBeds: 1,
                totalDoctors: 1,
                avgRating: { $round: ['$avgRating', 2] },
                _id: 0,
            },
        },
        {
            $sort: { count: -1 },
        },
    ]);

    const cityStats = await this.aggregate([
        {
            $group: {
                _id: '$address.city',
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                city: '$_id',
                count: 1,
                _id: 0,
            },
        },
        {
            $sort: { count: -1 },
        },
        {
            $limit: 10,
        },
    ]);

    return {
        ...(stats[0] || {}),
        byType: typeStats,
        byCity: cityStats,
    };
};

/**
 * Export Facility model
 */
module.exports = mongoose.model('Facility', facilitySchema);