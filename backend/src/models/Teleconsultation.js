const mongoose = require('mongoose');

/**
 * Teleconsultation Schema
 */
const teleconsultationSchema = new mongoose.Schema({
    // Primary References
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [true, 'Appointment is required'],
        unique: true,
    },

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

    // Session Information
    roomId: {
        type: String,
        required: [true, 'Room ID is required'],
        unique: true,
    },

    sessionId: {
        type: String,
        unique: true,
        sparse: true,
    },

    // Session Details
    scheduledAt: {
        type: Date,
        required: [true, 'Scheduled time is required'],
    },

    startedAt: {
        type: Date,
        default: null,
    },

    endedAt: {
        type: Date,
        default: null,
    },

    // Status Management
    status: {
        type: String,
        enum: ['scheduled', 'active', 'completed', 'cancelled', 'no_show', 'failed'],
        default: 'scheduled',
    },

    // Connection Information
    platform: {
        type: String,
        enum: ['jitsi', 'zoom', 'google_meet', 'custom', 'other'],
        default: 'jitsi',
    },

    meetingUrl: {
        type: String,
        required: [true, 'Meeting URL is required'],
    },

    meetingId: String,

    meetingPassword: {
        type: String,
        select: false,
    },

    // Participant Information
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        role: {
            type: String,
            enum: ['patient', 'doctor', 'assistant', 'family_member', 'interpreter', 'observer'],
        },
        joinedAt: Date,
        leftAt: Date,
        duration: Number, // in minutes
        connectionQuality: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor', 'disconnected'],
        },
    }],

    // Technical Details
    technicalDetails: {
        patientDevice: String,
        doctorDevice: String,
        patientBrowser: String,
        doctorBrowser: String,
        patientOS: String,
        doctorOS: String,
        patientNetwork: String,
        doctorNetwork: String,
        videoQuality: {
            type: String,
            enum: ['hd', 'sd', 'low', 'unknown'],
            default: 'unknown',
        },
        audioQuality: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor', 'unknown'],
            default: 'unknown',
        },
        issuesReported: [String],
    },

    // Session Recording
    recordingEnabled: {
        type: Boolean,
        default: false,
    },

    recordingUrl: String,

    recordingStartTime: Date,

    recordingEndTime: Date,

    recordingSize: Number, // in bytes

    // Consent Management
    consentObtained: {
        type: Boolean,
        default: false,
    },

    consentTime: Date,

    consentFormUrl: String,

    // Payment Information
    consultationFee: {
        type: Number,
        required: [true, 'Consultation fee is required'],
        min: [0, 'Consultation fee cannot be negative'],
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'cancelled'],
        default: 'pending',
    },

    paymentMethod: {
        type: String,
        enum: ['online', 'wallet', 'insurance', 'cash', null],
        default: null,
    },

    transactionId: String,

    // Session Feedback
    patientRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        default: null,
    },

    patientFeedback: String,

    doctorRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        default: null,
    },

    doctorFeedback: String,

    technicalRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        default: null,
    },

    // Follow-up Information
    followUpRequired: {
        type: Boolean,
        default: false,
    },

    followUpAppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null,
    },

    followUpNotes: String,

    // Medical Record Reference
    medicalRecord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord',
        default: null,
    },

    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        default: null,
    },

    // Session Logs
    logs: [{
        timestamp: {
            type: Date,
            default: Date.now,
        },
        event: {
            type: String,
            enum: [
                'room_created',
                'doctor_joined',
                'patient_joined',
                'consultation_started',
                'consultation_ended',
                'recording_started',
                'recording_stopped',
                'technical_issue',
                'prescription_created',
                'payment_processed',
                'session_extended',
                'session_terminated'
            ],
        },
        details: mongoose.Schema.Types.Mixed,
        initiatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    }],

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
 * Virtual for session duration
 */
teleconsultationSchema.virtual('duration').get(function () {
    if (!this.startedAt || !this.endedAt) return 0;

    const durationMs = this.endedAt - this.startedAt;
    return Math.floor(durationMs / 60000); // Convert to minutes
});

/**
 * Virtual for is active
 */
teleconsultationSchema.virtual('isActive').get(function () {
    return this.status === 'active';
});

/**
 * Virtual for is upcoming
 */
teleconsultationSchema.virtual('isUpcoming').get(function () {
    const now = new Date();
    return this.status === 'scheduled' && this.scheduledAt > now;
});

/**
 * Indexes
 */
teleconsultationSchema.index({ roomId: 1 }, { unique: true });
teleconsultationSchema.index({ appointment: 1 }, { unique: true });
teleconsultationSchema.index({ patient: 1, scheduledAt: -1 });
teleconsultationSchema.index({ doctor: 1, scheduledAt: -1 });
teleconsultationSchema.index({ status: 1 });
teleconsultationSchema.index({ scheduledAt: 1 });
teleconsultationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Teleconsultation', teleconsultationSchema);