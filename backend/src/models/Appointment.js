const mongoose = require('mongoose');

/**
 * Appointment Schema
 */
const appointmentSchema = new mongoose.Schema({
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

    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: [true, 'Facility is required'],
    },

    // Appointment Details
    appointmentType: {
        type: String,
        enum: ['in_person', 'teleconsultation', 'follow_up'],
        default: 'in_person',
    },

    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required'],
        validate: {
            validator: function (v) {
                return v >= new Date();
            },
            message: 'Appointment date cannot be in the past',
        },
    },

    appointmentTime: {
        type: String, // Format: "HH:mm"
        required: [true, 'Appointment time is required'],
        validate: {
            validator: function (v) {
                return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(v);
            },
            message: 'Appointment time must be in HH:mm format',
        },
    },

    duration: {
        type: Number, // in minutes
        default: 15,
        min: [5, 'Duration must be at least 5 minutes'],
        max: [120, 'Duration cannot exceed 120 minutes'],
    },

    // Status Management
    status: {
        type: String,
        enum: ['BOOKED', 'CONFIRMED', 'CHECKED_IN', 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'],
        default: 'BOOKED',
    },

    tokenNumber: {
        type: String,
        unique: true,
        sparse: true,
    },

    // Queue Information
    queuePosition: {
        type: Number,
        default: null,
    },

    estimatedWaitingTime: {
        type: Number, // in minutes
        default: 0,
    },

    actualWaitingTime: {
        type: Number, // in minutes
        default: 0,
    },

    // Clinical Information
    symptoms: [{
        type: String,
        trim: true,
    }],

    chiefComplaint: {
        type: String,
        trim: true,
        maxlength: [500, 'Chief complaint cannot exceed 500 characters'],
    },

    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    priority: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine',
    },

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
        enum: ['cash', 'card', 'upi', 'insurance', null],
        default: null,
    },

    transactionId: String,

    // Insurance Information
    insuranceUsed: {
        type: Boolean,
        default: false,
    },

    insuranceAmount: {
        type: Number,
        default: 0,
    },

    insuranceProvider: String,

    // Related Records
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

    followUpAppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null,
    },

    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral',
        default: null,
    },

    // Cancellation Information
    cancelledBy: {
        type: String,
        enum: ['patient', 'doctor', 'system', 'admin', null],
        default: null,
    },

    cancellationReason: String,

    cancellationNotes: String,

    // Check-in Information
    checkedInAt: {
        type: Date,
        default: null,
    },

    checkedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    // Consultation Information
    consultationStartTime: {
        type: Date,
        default: null,
    },

    consultationEndTime: {
        type: Date,
        default: null,
    },

    actualConsultationTime: {
        type: Number, // in minutes
        default: 0,
    },

    // Teleconsultation Information
    teleconsultationRoomId: {
        type: String,
        default: null,
    },

    teleconsultationLink: {
        type: String,
        default: null,
    },

    // Notification Flags
    remindersSent: {
        type: Number,
        default: 0,
    },

    lastReminderSentAt: Date,

    // Rating and Feedback
    patientRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        default: null,
    },

    patientFeedback: String,

    doctorFeedback: String,

    // Audit Information
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
 * Virtual for appointment date and time
 */
appointmentSchema.virtual('appointmentDateTime').get(function () {
    if (!this.appointmentDate || !this.appointmentTime) return null;

    const date = new Date(this.appointmentDate);
    const [hours, minutes] = this.appointmentTime.split(':').map(Number);

    date.setHours(hours, minutes, 0, 0);
    return date;
});

/**
 * Virtual for is upcoming
 */
appointmentSchema.virtual('isUpcoming').get(function () {
    const now = new Date();
    const appointmentTime = this.appointmentDateTime;

    if (!appointmentTime) return false;
    return appointmentTime > now && this.status === 'BOOKED';
});

/**
 * Virtual for is today
 */
appointmentSchema.virtual('isToday').get(function () {
    if (!this.appointmentDate) return false;

    const today = new Date();
    const appointmentDate = new Date(this.appointmentDate);

    return today.toDateString() === appointmentDate.toDateString();
});

/**
 * Virtual for time until appointment
 */
appointmentSchema.virtual('timeUntilAppointment').get(function () {
    if (!this.appointmentDateTime) return null;

    const now = new Date();
    const appointmentTime = this.appointmentDateTime;
    const diffMs = appointmentTime - now;

    if (diffMs <= 0) return null;

    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    if (diffHours > 0) {
        return `${diffHours}h ${remainingMinutes}m`;
    }

    return `${remainingMinutes}m`;
});

/**
 * Indexes
 */
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ facility: 1, appointmentDate: -1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ tokenNumber: 1 }, { sparse: true });
appointmentSchema.index({ createdBy: 1 });
appointmentSchema.index({ createdAt: -1 });
appointmentSchema.index({ 'appointmentDate': 1, 'status': 1 });
appointmentSchema.index({ patient: 1, doctor: 1, status: 1 });

/**
 * Compound indexes for unique appointments
 */
appointmentSchema.index(
    { doctor: 1, appointmentDate: 1, appointmentTime: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ['BOOKED', 'CONFIRMED', 'CHECKED_IN', 'IN_QUEUE', 'IN_PROGRESS'] }
        }
    }
);

/**
 * Pre-save middleware
 */
appointmentSchema.pre('save', function (next) {
    // Update updatedAt timestamp
    this.updatedAt = Date.now();

    // Generate token number if not set
    if (!this.tokenNumber && this.status === 'BOOKED') {
        const date = new Date();
        const prefix = this.facility ? 'A' : 'T';
        this.tokenNumber = `${prefix}-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }

    // Calculate actual waiting time
    if (this.checkedInAt && this.consultationStartTime) {
        const waitingMs = this.consultationStartTime - this.checkedInAt;
        this.actualWaitingTime = Math.floor(waitingMs / 60000); // Convert to minutes
    }

    // Calculate actual consultation time
    if (this.consultationStartTime && this.consultationEndTime) {
        const consultationMs = this.consultationEndTime - this.consultationStartTime;
        this.actualConsultationTime = Math.floor(consultationMs / 60000); // Convert to minutes
    }

    next();
});

/**
 * Method to check in patient
 */
appointmentSchema.methods.checkIn = function (userId) {
    if (this.status !== 'BOOKED' && this.status !== 'CONFIRMED') {
        throw new Error('Appointment must be BOOKED or CONFIRMED to check in');
    }

    this.status = 'CHECKED_IN';
    this.checkedInAt = Date.now();
    this.checkedInBy = userId;

    return this.save();
};

/**
 * Method to join queue
 */
appointmentSchema.methods.joinQueue = function (position, waitingTime) {
    if (this.status !== 'CHECKED_IN') {
        throw new Error('Patient must be checked in to join queue');
    }

    this.status = 'IN_QUEUE';
    this.queuePosition = position;
    this.estimatedWaitingTime = waitingTime;

    return this.save();
};

/**
 * Method to start consultation
 */
appointmentSchema.methods.startConsultation = function () {
    if (this.status !== 'IN_QUEUE') {
        throw new Error('Patient must be in queue to start consultation');
    }

    this.status = 'IN_PROGRESS';
    this.consultationStartTime = Date.now();
    this.queuePosition = null;

    return this.save();
};

/**
 * Method to complete consultation
 */
appointmentSchema.methods.completeConsultation = function () {
    if (this.status !== 'IN_PROGRESS') {
        throw new Error('Consultation must be in progress to complete');
    }

    this.status = 'COMPLETED';
    this.consultationEndTime = Date.now();

    // Calculate actual consultation time
    if (this.consultationStartTime) {
        const consultationMs = Date.now() - this.consultationStartTime;
        this.actualConsultationTime = Math.floor(consultationMs / 60000);
    }

    return this.save();
};

/**
 * Method to cancel appointment
 */
appointmentSchema.methods.cancelAppointment = function (cancelledBy, reason = '', notes = '') {
    if (['COMPLETED', 'CANCELLED'].includes(this.status)) {
        throw new Error(`Cannot cancel appointment with status: ${this.status}`);
    }

    this.status = 'CANCELLED';
    this.cancelledBy = cancelledBy;
    this.cancellationReason = reason;
    this.cancellationNotes = notes;

    return this.save();
};

/**
 * Method to reschedule appointment
 */
appointmentSchema.methods.reschedule = function (newDate, newTime) {
    if (['COMPLETED', 'CANCELLED'].includes(this.status)) {
        throw new Error(`Cannot reschedule appointment with status: ${this.status}`);
    }

    // Create a new appointment record for rescheduling
    // In practice, you might want to create a new appointment and mark this as rescheduled

    this.status = 'RESCHEDULED';
    return this.save();
};

/**
 * Method to mark as no show
 */
appointmentSchema.methods.markAsNoShow = function () {
    if (this.status !== 'BOOKED' && this.status !== 'CONFIRMED') {
        throw new Error('Only BOOKED or CONFIRMED appointments can be marked as no show');
    }

    this.status = 'NO_SHOW';
    return this.save();
};

/**
 * Method to update payment status
 */
appointmentSchema.methods.updatePayment = function (status, method = null, transactionId = null) {
    this.paymentStatus = status;

    if (method) {
        this.paymentMethod = method;
    }

    if (transactionId) {
        this.transactionId = transactionId;
    }

    return this.save();
};

/**
 * Method to update rating
 */
appointmentSchema.methods.updateRating = function (rating, feedback = '') {
    if (this.status !== 'COMPLETED') {
        throw new Error('Only completed appointments can be rated');
    }

    this.patientRating = rating;
    this.patientFeedback = feedback;
    return this.save();
};

/**
 * Static method to find by patient
 */
appointmentSchema.statics.findByPatient = function (patientId, filters = {}) {
    const query = { patient: patientId, ...filters };

    return this.find(query)
        .populate('doctor', 'doctorName specialization consultationFee')
        .populate('facility', 'name facilityType address')
        .sort({ appointmentDate: -1, appointmentTime: -1 });
};

/**
 * Static method to find by doctor
 */
appointmentSchema.statics.findByDoctor = function (doctorId, filters = {}) {
    const query = { doctor: doctorId, ...filters };

    return this.find(query)
        .populate('patient', 'fullName dateOfBirth gender bloodGroup')
        .populate('facility', 'name facilityType')
        .sort({ appointmentDate: -1, appointmentTime: -1 });
};

/**
 * Static method to find today's appointments
 */
appointmentSchema.statics.findTodaysAppointments = function (facilityId = null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const query = {
        appointmentDate: { $gte: today, $lt: tomorrow },
        status: { $in: ['BOOKED', 'CONFIRMED', 'CHECKED_IN', 'IN_QUEUE', 'IN_PROGRESS'] },
    };

    if (facilityId) {
        query.facility = facilityId;
    }

    return this.find(query)
        .populate('patient', 'fullName phone')
        .populate('doctor', 'doctorName specialization')
        .populate('facility', 'name')
        .sort({ appointmentTime: 1 });
};

/**
 * Static method to find upcoming appointments
 */
appointmentSchema.statics.findUpcomingAppointments = function (patientId, limit = 10) {
    const now = new Date();

    return this.find({
        patient: patientId,
        appointmentDate: { $gte: now },
        status: { $in: ['BOOKED', 'CONFIRMED'] },
    })
        .populate('doctor', 'doctorName specialization consultationFee')
        .populate('facility', 'name facilityType address')
        .sort({ appointmentDate: 1, appointmentTime: 1 })
        .limit(limit);
};

/**
 * Static method to get appointment statistics
 */
appointmentSchema.statics.getStatistics = async function (facilityId = null, startDate = null, endDate = null) {
    const matchStage = {};

    if (facilityId) {
        matchStage.facility = facilityId;
    }

    if (startDate && endDate) {
        matchStage.appointmentDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const stats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                booked: {
                    $sum: { $cond: [{ $eq: ['$status', 'BOOKED'] }, 1, 0] },
                },
                confirmed: {
                    $sum: { $cond: [{ $eq: ['$status', 'CONFIRMED'] }, 1, 0] },
                },
                completed: {
                    $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
                },
                cancelled: {
                    $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] },
                },
                noShow: {
                    $sum: { $cond: [{ $eq: ['$status', 'NO_SHOW'] }, 1, 0] },
                },
                totalRevenue: { $sum: '$consultationFee' },
                avgWaitingTime: { $avg: '$actualWaitingTime' },
                avgConsultationTime: { $avg: '$actualConsultationTime' },
                avgRating: { $avg: '$patientRating' },
            },
        },
        {
            $project: {
                _id: 0,
                total: 1,
                booked: 1,
                confirmed: 1,
                completed: 1,
                cancelled: 1,
                noShow: 1,
                completionRate: {
                    $cond: [
                        { $eq: ['$total', 0] },
                        0,
                        { $multiply: [{ $divide: ['$completed', { $subtract: ['$total', { $add: ['$cancelled', '$noShow'] }] }] }, 100] },
                    ],
                },
                cancellationRate: {
                    $cond: [
                        { $eq: ['$total', 0] },
                        0,
                        { $multiply: [{ $divide: ['$cancelled', '$total'] }, 100] },
                    ],
                },
                noShowRate: {
                    $cond: [
                        { $eq: ['$total', 0] },
                        0,
                        { $multiply: [{ $divide: ['$noShow', '$total'] }, 100] },
                    ],
                },
                totalRevenue: 1,
                avgWaitingTime: { $round: ['$avgWaitingTime', 1] },
                avgConsultationTime: { $round: ['$avgConsultationTime', 1] },
                avgRating: { $round: ['$avgRating', 2] },
            },
        },
    ]);

    const dailyStats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' } },
                count: { $sum: 1 },
                completed: {
                    $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
                },
                revenue: { $sum: '$consultationFee' },
            },
        },
        {
            $project: {
                date: '$_id',
                count: 1,
                completed: 1,
                revenue: 1,
                completionRate: {
                    $cond: [
                        { $eq: ['$count', 0] },
                        0,
                        { $multiply: [{ $divide: ['$completed', '$count'] }, 100] },
                    ],
                },
                _id: 0,
            },
        },
        { $sort: { date: -1 } },
        { $limit: 30 },
    ]);

    const doctorStats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$doctor',
                count: { $sum: 1 },
                completed: {
                    $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
                },
                avgRating: { $avg: '$patientRating' },
                avgConsultationTime: { $avg: '$actualConsultationTime' },
            },
        },
        {
            $lookup: {
                from: 'doctors',
                localField: '_id',
                foreignField: '_id',
                as: 'doctorInfo',
            },
        },
        { $unwind: '$doctorInfo' },
        {
            $project: {
                doctorId: '$_id',
                doctorName: '$doctorInfo.doctorName',
                specialization: '$doctorInfo.specialization',
                count: 1,
                completed: 1,
                completionRate: {
                    $cond: [
                        { $eq: ['$count', 0] },
                        0,
                        { $multiply: [{ $divide: ['$completed', '$count'] }, 100] },
                    ],
                },
                avgRating: { $round: ['$avgRating', 2] },
                avgConsultationTime: { $round: ['$avgConsultationTime', 1] },
                _id: 0,
            },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    return {
        ...(stats[0] || {}),
        dailyStats: dailyStats.reverse(),
        topDoctors: doctorStats,
    };
};

/**
 * Export Appointment model
 */
module.exports = mongoose.model('Appointment', appointmentSchema);