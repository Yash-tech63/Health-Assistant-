const mongoose = require('mongoose');

/**
 * Prescription Schema
 */
const prescriptionSchema = new mongoose.Schema({
    // Primary References
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient is required'],
    },

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor is required'],
    },

    medicalRecord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord',
        required: [true, 'Medical record is required'],
    },

    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [true, 'Appointment is required'],
    },

    // Prescription Details
    prescriptionDate: {
        type: Date,
        required: [true, 'Prescription date is required'],
        default: Date.now,
    },

    prescriptionNumber: {
        type: String,
        unique: true,
        required: [true, 'Prescription number is required'],
    },

    // Medications
    medications: [{
        medicineName: {
            type: String,
            required: [true, 'Medicine name is required'],
            trim: true,
        },

        genericName: {
            type: String,
            trim: true,
        },

        dosageForm: {
            type: String,
            enum: ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'cream', 'drops', 'inhaler', 'other'],
            required: true,
        },

        strength: {
            type: String,
            required: true,
            trim: true,
        },

        dosage: {
            type: String,
            required: true,
            trim: true,
        },

        frequency: {
            type: String,
            required: true,
            trim: true,
        },

        duration: {
            type: String,
            required: true,
            trim: true,
        },

        route: {
            type: String,
            enum: ['oral', 'iv', 'im', 'sc', 'topical', 'inhalation', 'rectal', 'vaginal', 'other'],
            default: 'oral',
        },

        instructions: {
            type: String,
            trim: true,
            maxlength: [500, 'Instructions cannot exceed 500 characters'],
        },

        beforeAfterFood: {
            type: String,
            enum: ['before', 'after', 'with', 'empty_stomach', 'as_directed', null],
            default: null,
        },

        timing: {
            morning: { type: Boolean, default: false },
            afternoon: { type: Boolean, default: false },
            evening: { type: Boolean, default: false },
            night: { type: Boolean, default: false },
        },

        startDate: {
            type: Date,
            default: Date.now,
        },

        endDate: Date,

        refillsAllowed: {
            type: Number,
            default: 0,
            min: [0, 'Refills cannot be negative'],
        },

        refillsUsed: {
            type: Number,
            default: 0,
            min: [0, 'Refills used cannot be negative'],
        },

        quantity: {
            type: Number,
            min: [1, 'Quantity must be at least 1'],
        },

        unit: {
            type: String,
            enum: ['tablets', 'capsules', 'ml', 'mg', 'g', 'units', 'puffs', 'applications', null],
            default: null,
        },

        isGenericAllowed: {
            type: Boolean,
            default: true,
        },

        isSubstitutable: {
            type: Boolean,
            default: true,
        },

        notes: String,
    }],

    // Clinical Information
    diagnosis: [{
        code: String,
        description: String,
    }],

    // Instructions
    instructions: {
        type: String,
        trim: true,
        maxlength: [1000, 'Instructions cannot exceed 1000 characters'],
    },

    dietaryRestrictions: [String],

    activityRestrictions: [String],

    followUpInstructions: {
        type: String,
        trim: true,
    },

    nextVisitDate: Date,

    // Status
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled', 'expired'],
        default: 'active',
    },

    isDigital: {
        type: Boolean,
        default: true,
    },

    // Pharmacy Information
    pharmacyDispensed: {
        type: Boolean,
        default: false,
    },

    pharmacy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        default: null,
    },

    dispensedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    dispensedAt: Date,

    // Validity
    validityDays: {
        type: Number,
        default: 30,
        min: [1, 'Validity must be at least 1 day'],
        max: [365, 'Validity cannot exceed 365 days'],
    },

    expiresAt: {
        type: Date,
        default: function () {
            const date = new Date();
            date.setDate(date.getDate() + this.validityDays);
            return date;
        },
    },

    // Signature
    doctorSignature: String,

    digitalSignature: {
        type: String,
        default: null,
    },

    signedAt: {
        type: Date,
        default: Date.now,
    },

    // Audit
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
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
 * Indexes
 */
prescriptionSchema.index({ prescriptionNumber: 1 }, { unique: true });
prescriptionSchema.index({ patient: 1, prescriptionDate: -1 });
prescriptionSchema.index({ doctor: 1, prescriptionDate: -1 });
prescriptionSchema.index({ appointment: 1 });
prescriptionSchema.index({ medicalRecord: 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ expiresAt: 1 });
prescriptionSchema.index({ 'medicines.medicineName': 'text' });

module.exports = mongoose.model('Prescription', prescriptionSchema);