const mongoose = require('mongoose');

/**
 * Doctor Schema
 */
const doctorSchema = new mongoose.Schema({
    // Reference to User
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    // Professional Information
    doctorName: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true,
        minlength: [2, 'Doctor name must be at least 2 characters'],
        maxlength: [150, 'Doctor name cannot exceed 150 characters'],
    },

    registrationNumber: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },

    // Specialization
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true,
    },

    qualifications: [{
        degree: {
            type: String,
            required: true,
            trim: true,
        },
        institution: {
            type: String,
            trim: true,
        },
        year: {
            type: Number,
            min: [1900, 'Year must be after 1900'],
            max: [new Date().getFullYear(), 'Year cannot be in the future'],
        },
        certificateUrl: String,
    }],

    experience: {
        type: Number, // in years
        required: [true, 'Experience is required'],
        min: [0, 'Experience cannot be negative'],
        max: [70, 'Experience cannot exceed 70 years'],
    },

    // Professional Details
    designation: {
        type: String,
        trim: true,
        default: 'Medical Practitioner',
    },

    about: {
        type: String,
        trim: true,
        maxlength: [1000, 'About section cannot exceed 1000 characters'],
    },

    languages: [{
        type: String,
        enum: ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'ml', 'kn', 'or', 'pa'],
    }],

    // Facility Association
    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: [true, 'Facility is required'],
    },

    // Consultation Details
    consultationFee: {
        type: Number,
        required: [true, 'Consultation fee is required'],
        min: [0, 'Consultation fee cannot be negative'],
    },

    followUpFee: {
        type: Number,
        default: 0,
        min: [0, 'Follow-up fee cannot be negative'],
    },

    // Availability
    isAvailable: {
        type: Boolean,
        default: true,
    },

    availableDays: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    }],

    availableSlots: [{
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            required: true,
        },
        startTime: {
            type: String, // Format: "HH:mm"
            required: true,
            validate: {
                validator: function (v) {
                    return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(v);
                },
                message: 'Start time must be in HH:mm format',
            },
        },
        endTime: {
            type: String, // Format: "HH:mm"
            required: true,
            validate: {
                validator: function (v) {
                    return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(v);
                },
                message: 'End time must be in HH:mm format',
            },
        },
        slotDuration: {
            type: Number, // in minutes
            default: 15,
            min: [5, 'Slot duration must be at least 5 minutes'],
            max: [60, 'Slot duration cannot exceed 60 minutes'],
        },
        maxPatients: {
            type: Number,
            default: 10,
            min: [1, 'Maximum patients must be at least 1'],
        },
    }],

    // Current Queue Information
    currentQueue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Queue',
        default: null,
    },

    currentToken: {
        type: String,
        default: null,
    },

    patientsInQueue: {
        type: Number,
        default: 0,
    },

    estimatedWaitingTime: {
        type: Number, // in minutes
        default: 0,
    },

    // Statistics
    totalConsultations: {
        type: Number,
        default: 0,
    },

    averageConsultationTime: {
        type: Number, // in minutes
        default: 15,
    },

    patientSatisfactionScore: {
        type: Number,
        min: [0, 'Satisfaction score cannot be less than 0'],
        max: [5, 'Satisfaction score cannot exceed 5'],
        default: 0,
    },

    // Consultation Preferences
    prefersTeleconsultation: {
        type: Boolean,
        default: false,
    },

    teleconsultationFee: {
        type: Number,
        default: 0,
        min: [0, 'Teleconsultation fee cannot be negative'],
    },

    // Communication Preferences
    preferredCommunication: {
        type: [String],
        default: ['app_notification'],
        enum: ['sms', 'email', 'whatsapp', 'call', 'app_notification'],
    },

    // Contact Information
    emergencyContact: {
        name: String,
        phone: String,
    },

    // Professional Documents
    documents: [{
        documentType: {
            type: String,
            enum: ['registration', 'degree', 'certificate', 'id_proof', 'other'],
            required: true,
        },
        documentUrl: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        verifiedAt: Date,
    }],

    // Status Flags
    isVerified: {
        type: Boolean,
        default: false,
    },

    verificationNotes: String,

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
 * Virtual for doctor's rating
 */
doctorSchema.virtual('rating').get(function () {
    return this.patientSatisfactionScore;
});

/**
 * Virtual for doctor's full profile
 */
doctorSchema.virtual('profile').get(function () {
    return {
        name: this.doctorName,
        specialization: this.specialization,
        experience: this.experience,
        consultationFee: this.consultationFee,
        isAvailable: this.isAvailable,
        facility: this.facility,
    };
});

/**
 * Indexes
 */
doctorSchema.index({ user: 1 }, { unique: true });
doctorSchema.index({ registrationNumber: 1 }, { sparse: true });
doctorSchema.index({ facility: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isAvailable: 1 });
doctorSchema.index({ consultationFee: 1 });
doctorSchema.index({ doctorName: 'text', specialization: 'text', about: 'text' });
doctorSchema.index({ 'availableSlots.day': 1, 'availableSlots.startTime': 1 });

/**
 * Pre-save middleware
 */
doctorSchema.pre('save', function (next) {
    // Update updatedAt timestamp
    this.updatedAt = Date.now();

    // Calculate estimated waiting time
    if (this.patientsInQueue > 0 && this.averageConsultationTime > 0) {
        this.estimatedWaitingTime = this.patientsInQueue * this.averageConsultationTime;
    }

    next();
});

/**
 * Method to update availability
 */
doctorSchema.methods.updateAvailability = function (isAvailable, availableDays = null) {
    this.isAvailable = isAvailable;

    if (availableDays) {
        this.availableDays = availableDays;
    }

    return this.save();
};

/**
 * Method to add consultation slot
 */
doctorSchema.methods.addSlot = function (slotData) {
    this.availableSlots.push(slotData);
    return this.save();
};

/**
 * Method to remove consultation slot
 */
doctorSchema.methods.removeSlot = function (slotId) {
    this.availableSlots = this.availableSlots.filter(
        slot => slot._id.toString() !== slotId
    );
    return this.save();
};

/**
 * Method to update consultation fee
 */
doctorSchema.methods.updateFee = function (consultationFee, followUpFee = null) {
    this.consultationFee = consultationFee;

    if (followUpFee !== null) {
        this.followUpFee = followUpFee;
    }

    return this.save();
};

/**
 * Method to join queue
 */
doctorSchema.methods.joinQueue = function (queueId) {
    this.currentQueue = queueId;
    return this.save();
};

/**
 * Method to leave queue
 */
doctorSchema.methods.leaveQueue = function () {
    this.currentQueue = null;
    this.currentToken = null;
    this.patientsInQueue = 0;
    this.estimatedWaitingTime = 0;
    return this.save();
};

/**
 * Method to call next patient
 */
doctorSchema.methods.callNextPatient = function (token) {
    this.currentToken = token;
    this.patientsInQueue = Math.max(0, this.patientsInQueue - 1);

    // Recalculate waiting time
    if (this.patientsInQueue > 0 && this.averageConsultationTime > 0) {
        this.estimatedWaitingTime = this.patientsInQueue * this.averageConsultationTime;
    } else {
        this.estimatedWaitingTime = 0;
    }

    return this.save();
};

/**
 * Method to add patient to queue
 */
doctorSchema.methods.addToQueue = function () {
    this.patientsInQueue += 1;

    // Recalculate waiting time
    if (this.averageConsultationTime > 0) {
        this.estimatedWaitingTime = this.patientsInQueue * this.averageConsultationTime;
    }

    return this.save();
};

/**
 * Method to update statistics
 */
doctorSchema.methods.updateStatistics = function (consultationTime, satisfactionScore = null) {
    this.totalConsultations += 1;

    // Update average consultation time (moving average)
    const totalTime = (this.averageConsultationTime * (this.totalConsultations - 1)) + consultationTime;
    this.averageConsultationTime = totalTime / this.totalConsultations;

    // Update satisfaction score if provided
    if (satisfactionScore !== null) {
        const totalScore = (this.patientSatisfactionScore * (this.totalConsultations - 1)) + satisfactionScore;
        this.patientSatisfactionScore = totalScore / this.totalConsultations;
    }

    return this.save();
};

/**
 * Method to verify doctor
 */
doctorSchema.methods.verifyDoctor = function (adminId, notes = '') {
    this.isVerified = true;
    this.verificationNotes = notes;

    // Mark documents as verified
    this.documents.forEach(doc => {
        if (!doc.verified) {
            doc.verified = true;
            doc.verifiedBy = adminId;
            doc.verifiedAt = Date.now();
        }
    });

    return this.save();
};

/**
 * Static method to find by user ID
 */
doctorSchema.statics.findByUserId = function (userId) {
    return this.findOne({ user: userId })
        .populate('user', 'name phone email')
        .populate('facility', 'name facilityType address');
};

/**
 * Static method to find available doctors
 */
doctorSchema.statics.findAvailableDoctors = function () {
    return this.find({ isAvailable: true, isVerified: true })
        .populate('user', 'name phone')
        .populate('facility', 'name facilityType address city state')
        .sort({ specialization: 1 });
};

/**
 * Static method to find doctors by specialization
 */
doctorSchema.statics.findBySpecialization = function (specialization) {
    return this.find({
        specialization: { $regex: specialization, $options: 'i' },
        isAvailable: true,
        isVerified: true,
    })
        .populate('user', 'name phone')
        .populate('facility', 'name facilityType address')
        .sort({ experience: -1 });
};

/**
 * Static method to find doctors by facility
 */
doctorSchema.statics.findByFacility = function (facilityId) {
    return this.find({ facility: facilityId, isVerified: true })
        .populate('user', 'name phone')
        .sort({ specialization: 1 });
};

/**
 * Static method to get doctor statistics
 */
doctorSchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                verified: {
                    $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] },
                },
                available: {
                    $sum: { $cond: [{ $eq: ['$isAvailable', true] }, 1, 0] },
                },
                avgExperience: { $avg: '$experience' },
                avgConsultationFee: { $avg: '$consultationFee' },
                avgConsultationTime: { $avg: '$averageConsultationTime' },
                avgSatisfactionScore: { $avg: '$patientSatisfactionScore' },
            },
        },
        {
            $project: {
                _id: 0,
                total: 1,
                verified: 1,
                available: 1,
                avgExperience: { $round: ['$avgExperience', 1] },
                avgConsultationFee: { $round: ['$avgConsultationFee', 2] },
                avgConsultationTime: { $round: ['$avgConsultationTime', 1] },
                avgSatisfactionScore: { $round: ['$avgSatisfactionScore', 2] },
            },
        },
    ]);

    const specializationStats = await this.aggregate([
        {
            $group: {
                _id: '$specialization',
                count: { $sum: 1 },
                avgExperience: { $avg: '$experience' },
                avgFee: { $avg: '$consultationFee' },
            },
        },
        {
            $project: {
                specialization: '$_id',
                count: 1,
                avgExperience: { $round: ['$avgExperience', 1] },
                avgFee: { $round: ['$avgFee', 2] },
                _id: 0,
            },
        },
        {
            $sort: { count: -1 },
        },
    ]);

    return {
        ...(stats[0] || {}),
        bySpecialization: specializationStats,
    };
};

/**
 * Export Doctor model
 */
module.exports = mongoose.model('Doctor', doctorSchema);