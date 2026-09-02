const mongoose = require('mongoose');

/**
 * Symptom Assessment Schema
 */
const symptomAssessmentSchema = new mongoose.Schema({
    // Primary References
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient is required'],
    },

    // Assessment Information
    assessmentDate: {
        type: Date,
        required: [true, 'Assessment date is required'],
        default: Date.now,
    },

    assessmentType: {
        type: String,
        enum: ['self_assessment', 'doctor_assessment', 'nurse_assessment', 'triage_assessment'],
        default: 'self_assessment',
    },

    // Symptoms
    symptoms: [{
        symptom: {
            type: String,
            required: true,
            trim: true,
        },

        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe'],
            default: 'moderate',
        },

        duration: {
            value: Number,
            unit: {
                type: String,
                enum: ['hours', 'days', 'weeks', 'months'],
                default: 'days',
            },
        },

        onset: {
            type: String,
            enum: ['gradual', 'sudden', 'unknown'],
            default: 'unknown',
        },

        frequency: {
            type: String,
            enum: ['constant', 'intermittent', 'occasional', 'unknown'],
            default: 'unknown',
        },

        triggers: [String],

        relievingFactors: [String],

        notes: String,
    }],

    // Patient Input
    chiefComplaint: {
        type: String,
        trim: true,
        maxlength: [500, 'Chief complaint cannot exceed 500 characters'],
    },

    durationText: {
        type: String,
        trim: true,
    },

    severityText: {
        type: String,
        trim: true,
    },

    // Additional Information
    age: Number,

    gender: String,

    pregnancyStatus: {
        type: String,
        enum: ['not_applicable', 'not_pregnant', 'pregnant', 'postpartum', 'unknown'],
        default: 'not_applicable',
    },

    existingConditions: [String],

    medications: [String],

    allergies: [String],

    recentTravel: {
        type: Boolean,
        default: false,
    },

    travelDetails: String,

    exposureToIllness: {
        type: Boolean,
        default: false,
    },

    exposureDetails: String,

    // Vital Signs (if collected)
    vitalSigns: {
        temperature: Number,
        heartRate: Number,
        bloodPressure: {
            systolic: Number,
            diastolic: Number,
        },
        respiratoryRate: Number,
        oxygenSaturation: Number,
        painScale: {
            type: Number,
            min: [0, 'Pain scale must be at least 0'],
            max: [10, 'Pain scale cannot exceed 10'],
        },
    },

    // Assessment Results
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        required: [true, 'Risk level is required'],
    },

    riskScore: {
        type: Number,
        min: [0, 'Risk score must be at least 0'],
        max: [100, 'Risk score cannot exceed 100'],
        default: 0,
    },

    // Recommendations
    recommendation: {
        type: String,
        required: [true, 'Recommendation is required'],
        trim: true,
        maxlength: [1000, 'Recommendation cannot exceed 1000 characters'],
    },

    recommendedAction: {
        type: String,
        enum: ['self_care', 'teleconsultation', 'clinic_visit', 'urgent_care', 'emergency_room', 'specialist_referral'],
        required: true,
    },

    recommendedTimeline: {
        type: String,
        enum: ['immediately', 'within_24_hours', 'within_48_hours', 'within_week', 'routine'],
        required: true,
    },

    // Escalation Information
    needsEscalation: {
        type: Boolean,
        default: false,
    },

    escalatedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    escalatedAt: {
        type: Date,
        default: null,
    },

    escalationReason: String,

    // Follow-up
    followUpRequired: {
        type: Boolean,
        default: false,
    },

    followUpDate: Date,

    followUpInstructions: String,

    // AI/ML Metadata
    modelVersion: String,

    confidenceScore: {
        type: Number,
        min: [0, 'Confidence score must be at least 0'],
        max: [1, 'Confidence score cannot exceed 1'],
        default: 0,
    },

    featuresUsed: [String],

    // Language
    language: {
        type: String,
        default: 'en',
        enum: ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'ml', 'kn', 'or', 'pa'],
    },

    // Disclaimer
    disclaimerAccepted: {
        type: Boolean,
        default: false,
    },

    disclaimerText: {
        type: String,
        default: 'This is AI-assisted guidance and not a medical diagnosis. Please consult a healthcare professional for proper diagnosis and treatment.',
    },

    // Status
    status: {
        type: String,
        enum: ['draft', 'completed', 'escalated', 'followed_up', 'archived'],
        default: 'completed',
    },

    // Related Records
    appointmentCreated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null,
    },

    referralCreated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral',
        default: null,
    },

    medicalRecord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord',
        default: null,
    },

    // Audit
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    assessedBy: {
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
symptomAssessmentSchema.index({ patient: 1, assessmentDate: -1 });
symptomAssessmentSchema.index({ riskLevel: 1 });
symptomAssessmentSchema.index({ assessmentType: 1 });
symptomAssessmentSchema.index({ recommendedAction: 1 });
symptomAssessmentSchema.index({ needsEscalation: 1 });
symptomAssessmentSchema.index({ 'symptoms.symptom': 'text', chiefComplaint: 'text' });
symptomAssessmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SymptomAssessment', symptomAssessmentSchema);