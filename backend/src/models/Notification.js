const mongoose = require('mongoose');

/**
 * Notification Schema
 */
const notificationSchema = new mongoose.Schema({
    // Target User
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },

    // Notification Details
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },

    type: {
        type: String,
        enum: [
            'appointment',
            'medication',
            'follow_up',
            'referral',
            'high_risk',
            'queue',
            'lab_report',
            'prescription',
            'payment',
            'system',
            'announcement',
            'emergency'
        ],
        required: [true, 'Notification type is required'],
    },

    // Reference to related entity
    referenceType: {
        type: String,
        enum: [
            'appointment',
            'prescription',
            'medical_record',
            'lab_report',
            'referral',
            'queue',
            'payment',
            'symptom_assessment',
            null
        ],
        default: null,
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },

    // Priority
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },

    // Delivery Information
    channels: [{
        type: String,
        enum: ['in_app', 'email', 'sms', 'push', 'whatsapp'],
        required: true,
    }],

    deliveryStatus: [{
        channel: {
            type: String,
            enum: ['in_app', 'email', 'sms', 'push', 'whatsapp'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
            default: 'pending',
        },
        sentAt: Date,
        deliveredAt: Date,
        readAt: Date,
        failureReason: String,
    }],

    // Read Status
    isRead: {
        type: Boolean,
        default: false,
    },

    readAt: {
        type: Date,
        default: null,
    },

    // Action Information
    actionRequired: {
        type: Boolean,
        default: false,
    },

    actionType: {
        type: String,
        enum: ['confirm', 'reschedule', 'cancel', 'pay', 'review', 'acknowledge', 'follow_up', null],
        default: null,
    },

    actionUrl: String,

    actionData: mongoose.Schema.Types.Mixed,

    // Scheduling
    scheduledFor: {
        type: Date,
        default: null,
    },

    sentAt: {
        type: Date,
        default: Date.now,
    },

    expiresAt: {
        type: Date,
        default: function () {
            const date = new Date();
            date.setDate(date.getDate() + 30); // Default 30 days expiry
            return date;
        },
    },

    // Metadata
    metadata: mongoose.Schema.Types.Mixed,

    language: {
        type: String,
        default: 'en',
        enum: ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'ml', 'kn', 'or', 'pa'],
    },

    // Status
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'sent', 'delivered', 'read', 'expired', 'cancelled'],
        default: 'sent',
    },

    // Audit
    createdBy: {
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
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ 'deliveryStatus.channel': 1, 'deliveryStatus.status': 1 });
notificationSchema.index({ referenceType: 1, referenceId: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);