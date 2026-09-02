const mongoose = require('mongoose');

/**
 * Referral Schema
 */
const referralSchema = new mongoose.Schema({
    // Primary References
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient is required'],
    },

    referringDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Referring doctor is required'],
    },

    referringFacility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: [true, 'Referring facility is required'],
    },

    targetFacility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: [true, 'Target facility is required'],
    },

    targetDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        default: null,
    },

    // Referral Details
    referralDate: {
        type: Date,
        required: [true, 'Referral date is required'],
        default: Date.now,
    },

    referralNumber: {
        type: String,
        unique: true,
        required: [true, 'Referral number is required'],
    },

    // Clinical Information
    reasonForReferral: {
        type: String,
        required: [true, 'Reason for referral is required'],
        trim: true,
        maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    },

    clinicalSummary: {
        type: String,
        trim: true,
        maxlength: [2000, 'Clinical summary cannot exceed 2000 characters'],
    },

    diagnosis: [{
        code: String,
        description: String,
    }],

    investigationsDone: [{
        testName: String,
        result: String,
        date: Date,
    }],

    treatmentGiven: [{
        medicineName: String,
        dosage: String,
        duration: String,
    }],

    // Priority and Urgency
    priority: {
        type: String,
        enum: ['normal', 'urgent', 'emergency'],
        default: 'normal',
    },

    urgencyReason: String,

    expectedResponseTime: {
        type: Number, // in hours
        default: 24,
    },

    // Status Management
    status: {
        type: String,
        enum: ['created', 'sent', 'received', 'reviewed', 'accepted', 'rejected', 'appointment_scheduled', 'completed', 'cancelled'],
        default: 'created',
    },

    statusHistory: [{
        status: String,
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
        notes: String,
    }],

    // Target Facility Response
    responseNotes: String,

    responseDate: Date,

    responseBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    rejectionReason: String,

    // Appointment Information
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null,
    },

    appointmentDate: Date,

    appointmentTime: String,

    // Transfer Information (for facility transfers)
    transferRequired: {
        type: Boolean,
        default: false,
    },

    ambulanceRequired: {
        type: Boolean,
        default: false,
    },

    transferNotes: String,

    // Communication
    communicationLog: [{
        type: {
            type: String,
            enum: ['email', 'sms', 'phone', 'in_app', 'fax'],
            required: true,
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
        sentTo: String,
        content: String,
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read', 'failed'],
            default: 'sent',
        },
    }],

    // Documents
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    }],

    // Follow-up
    followUpRequired: {
        type: Boolean,
        default: false,
    },

    followUpDate: Date,

    followUpNotes: String,

    // Completion Information
    completionDate: Date,

    completionNotes: String,

    outcome: {
        type: String,
        enum: ['successful', 'partially_successful', 'unsuccessful', 'patient_did_not_attend', 'cancelled'],
        default: null,
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
referralSchema.index({ referralNumber: 1 }, { unique: true });
referralSchema.index({ patient: 1, referralDate: -1 });
referralSchema.index({ referringDoctor: 1 });
referralSchema.index({ referringFacility: 1 });
referralSchema.index({ targetFacility: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ priority: 1 });
referralSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Referral', referralSchema);