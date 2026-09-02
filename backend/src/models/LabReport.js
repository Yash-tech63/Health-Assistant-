const mongoose = require('mongoose');

/**
 * Lab Report Schema
 */
const labReportSchema = new mongoose.Schema({
    // Primary References
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient is required'],
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

    // Laboratory Information
    laboratory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: [true, 'Laboratory is required'],
    },

    // Report Details
    reportNumber: {
        type: String,
        unique: true,
        required: [true, 'Report number is required'],
    },

    reportDate: {
        type: Date,
        required: [true, 'Report date is required'],
        default: Date.now,
    },

    collectedDate: {
        type: Date,
        required: [true, 'Collection date is required'],
    },

    receivedDate: {
        type: Date,
        default: null,
    },

    // Test Information
    testName: {
        type: String,
        required: [true, 'Test name is required'],
        trim: true,
    },

    testType: {
        type: String,
        enum: ['blood', 'urine', 'stool', 'imaging', 'ecg', 'ultrasound', 'xray', 'mri', 'ct', 'biopsy', 'culture', 'other'],
        required: true,
    },

    testCategory: {
        type: String,
        enum: ['hematology', 'biochemistry', 'microbiology', 'immunology', 'histopathology', 'radiology', 'cardiology', 'other'],
        required: true,
    },

    // Test Results
    results: [{
        parameter: {
            type: String,
            required: true,
            trim: true,
        },

        value: {
            type: String,
            required: true,
            trim: true,
        },

        unit: {
            type: String,
            trim: true,
        },

        normalRange: {
            min: Number,
            max: Number,
            unit: String,
        },

        interpretation: {
            type: String,
            enum: ['normal', 'low', 'high', 'abnormal', 'critical'],
            default: 'normal',
        },

        flags: [String],

        notes: String,
    }],

    // Report Content
    findings: {
        type: String,
        trim: true,
        maxlength: [2000, 'Findings cannot exceed 2000 characters'],
    },

    impression: {
        type: String,
        trim: true,
        maxlength: [1000, 'Impression cannot exceed 1000 characters'],
    },

    recommendation: {
        type: String,
        trim: true,
        maxlength: [1000, 'Recommendation cannot exceed 1000 characters'],
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'collected', 'processing', 'ready_for_review', 'completed', 'cancelled'],
        default: 'pending',
    },

    priority: {
        type: String,
        enum: ['routine', 'urgent', 'stat'],
        default: 'routine',
    },

    // File Information
    reportFileUrl: {
        type: String,
        required: [true, 'Report file URL is required'],
    },

    fileFormat: {
        type: String,
        enum: ['pdf', 'jpg', 'png', 'dicom', 'other'],
        default: 'pdf',
    },

    fileSize: {
        type: Number, // in bytes
        default: 0,
    },

    // Verification
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    verifiedAt: {
        type: Date,
        default: null,
    },

    // Quality Control
    qualityControlPassed: {
        type: Boolean,
        default: false,
    },

    qualityControlNotes: String,

    // Critical Values
    hasCriticalValues: {
        type: Boolean,
        default: false,
    },

    criticalValuesNotified: {
        type: Boolean,
        default: false,
    },

    criticalValuesNotifiedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    criticalValuesNotifiedAt: Date,

    // Audit Trail
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
labReportSchema.index({ reportNumber: 1 }, { unique: true });
labReportSchema.index({ patient: 1, reportDate: -1 });
labReportSchema.index({ medicalRecord: 1 });
labReportSchema.index({ appointment: 1 });
labReportSchema.index({ laboratory: 1 });
labReportSchema.index({ testName: 'text', findings: 'text', impression: 'text' });
labReportSchema.index({ status: 1 });
labReportSchema.index({ hasCriticalValues: 1 });
labReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LabReport', labReportSchema);