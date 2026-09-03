const mongoose = require('mongoose');

/**
 * Patient Schema
 */
const patientSchema = new mongoose.Schema({
    // Reference to User
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    // Personal Information
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters'],
        maxlength: [150, 'Full name cannot exceed 150 characters'],
    },

    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function (v) {
                return v <= new Date();
            },
            message: 'Date of birth cannot be in the future',
        },
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Gender is required'],
    },

    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', null],
        default: null,
    },

    // Contact Information
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
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
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India',
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0],
            },
        },
    },

    // Emergency Contact
    emergencyContact: {
        name: {
            type: String,
            trim: true,
        },
        relationship: {
            type: String,
            enum: ['parent', 'spouse', 'husband', 'wife', 'sibling', 'child', 'relative', 'friend', 'other', null],
            default: null,
        },
        phone: {
            type: String,
            validate: {
                validator: function (v) {
                    return !v || /^\+?[1-9]\d{9,14}$/.test(v);
                },
                message: 'Please enter a valid emergency contact phone number',
            },
        },
    },

    // Medical Information
    allergies: [{
        allergen: {
            type: String,
            trim: true,
        },
        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe'],
            default: 'moderate',
        },
        reaction: String,
        notes: String,
    }],

    chronicDiseases: [{
        disease: {
            type: String,
            trim: true,
        },
        diagnosedDate: Date,
        status: {
            type: String,
            enum: ['active', 'controlled', 'in_remission', 'resolved'],
            default: 'active',
        },
        medications: [String],
        notes: String,
    }],

    currentMedications: [{
        medicineName: {
            type: String,
            trim: true,
            required: true,
        },
        dosage: {
            type: String,
            required: true,
        },
        frequency: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: Date,
        prescribedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
        },
        notes: String,
    }],

    // Basic Health Information
    basicHealthInformation: {
        height: {
            type: Number, // in cm
            min: [50, 'Height must be at least 50 cm'],
            max: [250, 'Height cannot exceed 250 cm'],
        },
        weight: {
            type: Number, // in kg
            min: [2, 'Weight must be at least 2 kg'],
            max: [300, 'Weight cannot exceed 300 kg'],
        },
        bmi: {
            type: Number,
            min: [10, 'BMI must be at least 10'],
            max: [70, 'BMI cannot exceed 70'],
        },
        bloodPressure: {
            systolic: Number,
            diastolic: Number,
        },
        pulseRate: {
            type: Number,
            min: [30, 'Pulse rate must be at least 30 bpm'],
            max: [200, 'Pulse rate cannot exceed 200 bpm'],
        },
        temperature: {
            type: Number,
            min: [30, 'Temperature must be at least 30°C'],
            max: [45, 'Temperature cannot exceed 45°C'],
        },
        oxygenSaturation: {
            type: Number,
            min: [50, 'Oxygen saturation must be at least 50%'],
            max: [100, 'Oxygen saturation cannot exceed 100%'],
        },
        lastUpdated: Date,
    },

    // Health Flags
    isHighRisk: {
        type: Boolean,
        default: false,
    },

    highRiskReason: String,

    highRiskSince: Date,

    // Insurance Information
    insurance: {
        provider: String,
        policyNumber: String,
        expiryDate: Date,
        coverageAmount: Number,
        coverageType: {
            type: String,
            enum: ['cashless', 'reimbursement', null],
            default: null,
        },
    },

    // Consent Management
    consentToShareData: {
        type: Boolean,
        default: false,
    },

    consentToResearch: {
        type: Boolean,
        default: false,
    },

    consentToEmergencyContact: {
        type: Boolean,
        default: true,
    },

    // Patient Preferences
    preferredLanguage: {
        type: String,
        default: 'en',
        enum: ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'ml', 'kn', 'or', 'pa'],
    },

    preferredCommunication: {
        type: [String],
        default: ['sms'],
        enum: ['sms', 'email', 'whatsapp', 'call', 'app_notification'],
    },

    // Statistics
    totalVisits: {
        type: Number,
        default: 0,
    },

    lastVisitDate: Date,

    averageConsultationTime: {
        type: Number,
        default: 15, // minutes
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
 * Virtual for age
 */
patientSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
});

/**
 * Virtual for BMI calculation
 */
patientSchema.virtual('calculatedBMI').get(function () {
    if (!this.basicHealthInformation?.height || !this.basicHealthInformation?.weight) {
        return null;
    }

    const heightInMeters = this.basicHealthInformation.height / 100;
    const weight = this.basicHealthInformation.weight;

    return weight / (heightInMeters * heightInMeters);
});

/**
 * Indexes
 */
patientSchema.index({ user: 1 }, { unique: true });
patientSchema.index({ phone: 1 }, { unique: true });
patientSchema.index({ 'address.coordinates': '2dsphere' });
patientSchema.index({ isHighRisk: 1 });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ fullName: 'text', phone: 'text', email: 'text' });

/**
 * Pre-save middleware
 */
patientSchema.pre('save', function (next) {
    // Update updatedAt timestamp
    this.updatedAt = Date.now();

    // Calculate BMI if height and weight are provided
    if (this.basicHealthInformation?.height && this.basicHealthInformation?.weight) {
        const heightInMeters = this.basicHealthInformation.height / 100;
        const weight = this.basicHealthInformation.weight;
        this.basicHealthInformation.bmi = weight / (heightInMeters * heightInMeters);
    }

    next();
});

/**
 * Method to update health information
 */
patientSchema.methods.updateHealthInfo = function (healthData) {
    this.basicHealthInformation = {
        ...this.basicHealthInformation,
        ...healthData,
        lastUpdated: Date.now(),
    };

    // Recalculate BMI if height or weight changed
    if (healthData.height || healthData.weight) {
        const height = healthData.height || this.basicHealthInformation.height;
        const weight = healthData.weight || this.basicHealthInformation.weight;

        if (height && weight) {
            const heightInMeters = height / 100;
            this.basicHealthInformation.bmi = weight / (heightInMeters * heightInMeters);
        }
    }

    return this.save();
};

/**
 * Method to add allergy
 */
patientSchema.methods.addAllergy = function (allergyData) {
    this.allergies.push(allergyData);
    return this.save();
};

/**
 * Method to add chronic disease
 */
patientSchema.methods.addChronicDisease = function (diseaseData) {
    this.chronicDiseases.push(diseaseData);
    return this.save();
};

/**
 * Method to add current medication
 */
patientSchema.methods.addMedication = function (medicationData) {
    this.currentMedications.push(medicationData);
    return this.save();
};

/**
 * Method to mark as high risk
 */
patientSchema.methods.markAsHighRisk = function (reason) {
    this.isHighRisk = true;
    this.highRiskReason = reason;
    this.highRiskSince = Date.now();
    return this.save();
};

/**
 * Method to remove high risk status
 */
patientSchema.methods.removeHighRiskStatus = function () {
    this.isHighRisk = false;
    this.highRiskReason = null;
    this.highRiskSince = null;
    return this.save();
};

/**
 * Static method to find by user ID
 */
patientSchema.statics.findByUserId = function (userId) {
    return this.findOne({ user: userId }).populate('user', 'name phone email role');
};

/**
 * Static method to find high risk patients
 */
patientSchema.statics.findHighRiskPatients = function () {
    return this.find({ isHighRisk: true })
        .populate('user', 'name phone email')
        .sort({ highRiskSince: -1 });
};

/**
 * Static method to get patient statistics
 */
patientSchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                highRisk: {
                    $sum: { $cond: [{ $eq: ['$isHighRisk', true] }, 1, 0] },
                },
                withAllergies: {
                    $sum: { $cond: [{ $gt: [{ $size: '$allergies' }, 0] }, 1, 0] },
                },
                withChronicDiseases: {
                    $sum: { $cond: [{ $gt: [{ $size: '$chronicDiseases' }, 0] }, 1, 0] },
                },
                averageAge: { $avg: { $subtract: [new Date(), '$dateOfBirth'] } },
            },
        },
        {
            $project: {
                _id: 0,
                total: 1,
                highRisk: 1,
                withAllergies: 1,
                withChronicDiseases: 1,
                averageAge: {
                    $divide: ['$averageAge', 365 * 24 * 60 * 60 * 1000], // Convert ms to years
                },
            },
        },
    ]);

    const genderStats = await this.aggregate([
        {
            $group: {
                _id: '$gender',
                count: { $sum: 1 },
            },
        },
    ]);

    const bloodGroupStats = await this.aggregate([
        {
            $group: {
                _id: '$bloodGroup',
                count: { $sum: 1 },
            },
        },
        {
            $match: { _id: { $ne: null } },
        },
    ]);

    return {
        ...(stats[0] || {}),
        byGender: genderStats,
        byBloodGroup: bloodGroupStats,
    };
};

/**
 * Export Patient model
 */
module.exports = mongoose.model('Patient', patientSchema);