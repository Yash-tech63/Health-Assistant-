const mongoose = require('mongoose');

/**
 * Queue Schema
 */
const queueSchema = new mongoose.Schema({
    // Queue Identification
    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: [true, 'Facility is required'],
    },

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor is required'],
    },

    queueDate: {
        type: Date,
        required: [true, 'Queue date is required'],
        default: Date.now,
    },

    queueType: {
        type: String,
        enum: ['general', 'emergency', 'follow_up', 'teleconsultation'],
        default: 'general',
    },

    // Queue Status
    isActive: {
        type: Boolean,
        default: true,
    },

    status: {
        type: String,
        enum: ['active', 'paused', 'closed', 'completed'],
        default: 'active',
    },

    // Queue Configuration
    consultationDuration: {
        type: Number, // in minutes
        default: 15,
        min: [5, 'Consultation duration must be at least 5 minutes'],
        max: [60, 'Consultation duration cannot exceed 60 minutes'],
    },

    maxQueueSize: {
        type: Number,
        default: 50,
        min: [1, 'Maximum queue size must be at least 1'],
        max: [500, 'Maximum queue size cannot exceed 500'],
    },

    // Current Queue State
    currentToken: {
        type: String,
        default: null,
    },

    nextToken: {
        type: String,
        default: null,
    },

    lastCalledToken: {
        type: String,
        default: null,
    },

    lastCalledAt: {
        type: Date,
        default: null,
    },

    // Queue Patients
    patients: [{
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        tokenNumber: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ['normal', 'urgent', 'emergency'],
            default: 'normal',
        },
        checkInTime: {
            type: Date,
            default: Date.now,
        },
        estimatedConsultationTime: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['waiting', 'called', 'in_consultation', 'completed', 'skipped', 'left'],
            default: 'waiting',
        },
        position: {
            type: Number,
            required: true,
        },
        waitingTime: {
            type: Number, // in minutes
            default: 0,
        },
        actualWaitingTime: {
            type: Number, // in minutes
            default: 0,
        },
    }],

    // Queue Statistics
    totalPatients: {
        type: Number,
        default: 0,
    },

    patientsWaiting: {
        type: Number,
        default: 0,
    },

    patientsConsulted: {
        type: Number,
        default: 0,
    },

    patientsSkipped: {
        type: Number,
        default: 0,
    },

    averageWaitingTime: {
        type: Number, // in minutes
        default: 0,
    },

    averageConsultationTime: {
        type: Number, // in minutes
        default: 0,
    },

    // Timing Information
    queueStartTime: {
        type: Date,
        default: Date.now,
    },

    queueEndTime: {
        type: Date,
        default: null,
    },

    estimatedEndTime: {
        type: Date,
        default: null,
    },

    // Performance Metrics
    efficiencyScore: {
        type: Number,
        min: [0, 'Efficiency score cannot be less than 0'],
        max: [100, 'Efficiency score cannot exceed 100'],
        default: 0,
    },

    patientSatisfactionScore: {
        type: Number,
        min: [0, 'Satisfaction score cannot be less than 0'],
        max: [5, 'Satisfaction score cannot exceed 5'],
        default: 0,
    },

    // Queue Management
    pausedReason: String,

    pausedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    pausedAt: Date,

    resumedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    resumedAt: Date,

    closedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    closedAt: Date,

    // Teleconsultation Queue Specific
    teleconsultationRoomId: String,

    teleconsultationLink: String,

    // Emergency Queue Specific
    isEmergencyQueue: {
        type: Boolean,
        default: false,
    },

    emergencySeverityLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical', null],
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
 * Virtual for queue duration
 */
queueSchema.virtual('queueDuration').get(function () {
    if (!this.queueStartTime) return 0;

    const endTime = this.queueEndTime || Date.now();
    const durationMs = endTime - this.queueStartTime;
    return Math.floor(durationMs / 60000); // Convert to minutes
});

/**
 * Virtual for estimated waiting time for new patients
 */
queueSchema.virtual('estimatedWaitingTimeForNew').get(function () {
    if (this.patientsWaiting <= 0 || this.consultationDuration <= 0) {
        return 0;
    }

    return this.patientsWaiting * this.consultationDuration;
});

/**
 * Virtual for is full
 */
queueSchema.virtual('isFull').get(function () {
    return this.patientsWaiting >= this.maxQueueSize;
});

/**
 * Virtual for next available slot
 */
queueSchema.virtual('nextAvailableSlot').get(function () {
    if (this.patientsWaiting >= this.maxQueueSize) {
        return null;
    }

    const now = new Date();
    const estimatedEndTime = new Date(now.getTime() + (this.estimatedWaitingTimeForNew * 60000));

    return {
        estimatedWait: this.estimatedWaitingTimeForNew,
        estimatedTime: estimatedEndTime,
        availablePosition: this.patientsWaiting + 1,
    };
});

/**
 * Indexes
 */
queueSchema.index({ facility: 1, doctor: 1, queueDate: 1 });
queueSchema.index({ doctor: 1, status: 1 });
queueSchema.index({ facility: 1, status: 1 });
queueSchema.index({ queueDate: 1, status: 1 });
queueSchema.index({ isActive: 1 });
queueSchema.index({ createdAt: -1 });
queueSchema.index({ 'patients.appointment': 1 });

/**
 * Pre-save middleware
 */
queueSchema.pre('save', function (next) {
    // Update updatedAt timestamp
    this.updatedAt = Date.now();

    // Update statistics
    this.totalPatients = this.patients.length;
    this.patientsWaiting = this.patients.filter(p => p.status === 'waiting').length;
    this.patientsConsulted = this.patients.filter(p => p.status === 'completed').length;
    this.patientsSkipped = this.patients.filter(p => p.status === 'skipped' || p.status === 'left').length;

    // Calculate average waiting time
    const completedPatients = this.patients.filter(p => p.status === 'completed');
    if (completedPatients.length > 0) {
        const totalWaitingTime = completedPatients.reduce((sum, patient) => sum + (patient.actualWaitingTime || 0), 0);
        this.averageWaitingTime = totalWaitingTime / completedPatients.length;
    }

    // Calculate estimated end time
    if (this.patientsWaiting > 0 && this.consultationDuration > 0) {
        const estimatedEnd = new Date(Date.now() + (this.patientsWaiting * this.consultationDuration * 60000));
        this.estimatedEndTime = estimatedEnd;
    }

    // Calculate efficiency score
    if (this.totalPatients > 0 && this.queueDuration > 0) {
        const idealPatients = Math.floor(this.queueDuration / this.consultationDuration);
        this.efficiencyScore = Math.min(100, (this.patientsConsulted / idealPatients) * 100);
    }

    // Set next token
    const nextPatient = this.patients.find(p => p.status === 'waiting');
    this.nextToken = nextPatient ? nextPatient.tokenNumber : null;

    next();
});

/**
 * Method to add patient to queue
 */
queueSchema.methods.addPatient = function (appointmentId, patientId, tokenNumber, priority = 'normal') {
    if (this.patientsWaiting >= this.maxQueueSize) {
        throw new Error('Queue is full');
    }

    if (!this.isActive || this.status !== 'active') {
        throw new Error('Queue is not active');
    }

    const position = this.patients.length + 1;

    // Calculate estimated consultation time
    const estimatedWait = this.patientsWaiting * this.consultationDuration;
    const estimatedConsultationTime = new Date(Date.now() + (estimatedWait * 60000));

    this.patients.push({
        appointment: appointmentId,
        patient: patientId,
        tokenNumber: tokenNumber,
        priority: priority,
        position: position,
        estimatedConsultationTime: estimatedConsultationTime,
    });

    return this.save();
};

/**
 * Method to call next patient
 */
queueSchema.methods.callNextPatient = function () {
    if (this.patientsWaiting === 0) {
        throw new Error('No patients waiting in queue');
    }

    if (!this.isActive || this.status !== 'active') {
        throw new Error('Queue is not active');
    }

    // Find next patient (considering priority)
    let nextPatientIndex = -1;

    // First check for emergency priority
    nextPatientIndex = this.patients.findIndex(p => p.status === 'waiting' && p.priority === 'emergency');

    // Then check for urgent priority
    if (nextPatientIndex === -1) {
        nextPatientIndex = this.patients.findIndex(p => p.status === 'waiting' && p.priority === 'urgent');
    }

    // Finally, check for normal priority
    if (nextPatientIndex === -1) {
        nextPatientIndex = this.patients.findIndex(p => p.status === 'waiting' && p.priority === 'normal');
    }

    if (nextPatientIndex === -1) {
        throw new Error('No patients available to call');
    }

    const nextPatient = this.patients[nextPatientIndex];

    // Update patient status
    nextPatient.status = 'called';
    nextPatient.actualWaitingTime = Math.floor((Date.now() - nextPatient.checkInTime) / 60000);

    // Update queue state
    this.lastCalledToken = nextPatient.tokenNumber;
    this.lastCalledAt = Date.now();
    this.currentToken = nextPatient.tokenNumber;

    // Update positions for remaining patients
    for (let i = nextPatientIndex + 1; i < this.patients.length; i++) {
        if (this.patients[i].status === 'waiting') {
            this.patients[i].position -= 1;
        }
    }

    return this.save();
};

/**
 * Method to mark consultation as completed
 */
queueSchema.methods.completeConsultation = function (tokenNumber) {
    const patientIndex = this.patients.findIndex(p => p.tokenNumber === tokenNumber);

    if (patientIndex === -1) {
        throw new Error(`Patient with token ${tokenNumber} not found in queue`);
    }

    const patient = this.patients[patientIndex];

    if (patient.status !== 'called' && patient.status !== 'in_consultation') {
        throw new Error(`Patient with token ${tokenNumber} is not in consultation`);
    }

    patient.status = 'completed';
    this.currentToken = null;

    return this.save();
};

/**
 * Method to skip patient
 */
queueSchema.methods.skipPatient = function (tokenNumber, reason = '') {
    const patientIndex = this.patients.findIndex(p => p.tokenNumber === tokenNumber);

    if (patientIndex === -1) {
        throw new Error(`Patient with token ${tokenNumber} not found in queue`);
    }

    const patient = this.patients[patientIndex];

    if (patient.status !== 'waiting' && patient.status !== 'called') {
        throw new Error(`Patient with token ${tokenNumber} cannot be skipped`);
    }

    patient.status = 'skipped';
    patient.notes = reason || patient.notes;

    // Update positions for remaining patients
    for (let i = patientIndex + 1; i < this.patients.length; i++) {
        if (this.patients[i].status === 'waiting') {
            this.patients[i].position -= 1;
        }
    }

    return this.save();
};

/**
 * Method to remove patient from queue
 */
queueSchema.methods.removePatient = function (tokenNumber, reason = 'left') {
    const patientIndex = this.patients.findIndex(p => p.tokenNumber === tokenNumber);

    if (patientIndex === -1) {
        throw new Error(`Patient with token ${tokenNumber} not found in queue`);
    }

    const patient = this.patients[patientIndex];

    if (patient.status === 'completed') {
        throw new Error(`Patient with token ${tokenNumber} has already completed consultation`);
    }

    patient.status = reason === 'left' ? 'left' : 'removed';
    patient.notes = reason || patient.notes;

    // Update positions for remaining patients
    for (let i = patientIndex + 1; i < this.patients.length; i++) {
        if (this.patients[i].status === 'waiting') {
            this.patients[i].position -= 1;
        }
    }

    return this.save();
};

/**
 * Method to pause queue
 */
queueSchema.methods.pauseQueue = function (userId, reason = '') {
    if (this.status !== 'active') {
        throw new Error(`Queue is already ${this.status}`);
    }

    this.status = 'paused';
    this.pausedBy = userId;
    this.pausedAt = Date.now();
    this.pausedReason = reason;

    return this.save();
};

/**
 * Method to resume queue
 */
queueSchema.methods.resumeQueue = function (userId) {
    if (this.status !== 'paused') {
        throw new Error(`Queue is not paused, current status: ${this.status}`);
    }

    this.status = 'active';
    this.resumedBy = userId;
    this.resumedAt = Date.now();

    return this.save();
};

/**
 * Method to close queue
 */
queueSchema.methods.closeQueue = function (userId) {
    if (this.status === 'closed' || this.status === 'completed') {
        throw new Error(`Queue is already ${this.status}`);
    }

    this.status = 'closed';
    this.closedBy = userId;
    this.closedAt = Date.now();
    this.queueEndTime = Date.now();
    this.isActive = false;

    return this.save();
};

/**
 * Method to get queue status
 */
queueSchema.methods.getQueueStatus = function () {
    const waitingPatients = this.patients.filter(p => p.status === 'waiting');
    const calledPatients = this.patients.filter(p => p.status === 'called' || p.status === 'in_consultation');
    const completedPatients = this.patients.filter(p => p.status === 'completed');

    return {
        queueId: this._id,
        facility: this.facility,
        doctor: this.doctor,
        status: this.status,
        isActive: this.isActive,

        currentToken: this.currentToken,
        nextToken: this.nextToken,
        lastCalledToken: this.lastCalledToken,
        lastCalledAt: this.lastCalledAt,

        statistics: {
            totalPatients: this.totalPatients,
            patientsWaiting: this.patientsWaiting,
            patientsCalled: calledPatients.length,
            patientsCompleted: this.patientsConsulted,
            patientsSkipped: this.patientsSkipped,
            averageWaitingTime: this.averageWaitingTime,
            averageConsultationTime: this.averageConsultationTime,
        },

        waitingList: waitingPatients.map(p => ({
            tokenNumber: p.tokenNumber,
            position: p.position,
            priority: p.priority,
            estimatedConsultationTime: p.estimatedConsultationTime,
            waitingTime: Math.floor((Date.now() - p.checkInTime) / 60000),
        })),

        estimatedEndTime: this.estimatedEndTime,
        queueDuration: this.queueDuration,
        efficiencyScore: this.efficiencyScore,
        isFull: this.isFull,
        nextAvailableSlot: this.nextAvailableSlot,
    };
};

/**
 * Static method to find active queue for doctor
 */
queueSchema.statics.findActiveQueueForDoctor = function (doctorId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.findOne({
        doctor: doctorId,
        queueDate: { $gte: today, $lt: tomorrow },
        status: { $in: ['active', 'paused'] },
        isActive: true,
    })
        .populate('facility', 'name facilityType')
        .populate('doctor', 'doctorName specialization')
        .populate('patients.patient', 'fullName');
};

/**
 * Static method to find queues by facility
 */
queueSchema.statics.findQueuesByFacility = function (facilityId, date = null) {
    const query = { facility: facilityId };

    if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        query.queueDate = { $gte: startDate, $lt: endDate };
    }

    return this.find(query)
        .populate('doctor', 'doctorName specialization')
        .sort({ queueDate: -1, createdAt: -1 });
};

/**
 * Static method to get queue statistics
 */
queueSchema.statics.getQueueStatistics = async function (facilityId = null, startDate = null, endDate = null) {
    const matchStage = {};

    if (facilityId) {
        matchStage.facility = facilityId;
    }

    if (startDate && endDate) {
        matchStage.queueDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const stats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalQueues: { $sum: 1 },
                activeQueues: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
                },
                completedQueues: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                },
                totalPatients: { $sum: '$totalPatients' },
                totalConsulted: { $sum: '$patientsConsulted' },
                avgWaitingTime: { $avg: '$averageWaitingTime' },
                avgEfficiencyScore: { $avg: '$efficiencyScore' },
                avgSatisfactionScore: { $avg: '$patientSatisfactionScore' },
            },
        },
        {
            $project: {
                _id: 0,
                totalQueues: 1,
                activeQueues: 1,
                completedQueues: 1,
                totalPatients: 1,
                totalConsulted: 1,
                consultationRate: {
                    $cond: [
                        { $eq: ['$totalPatients', 0] },
                        0,
                        { $multiply: [{ $divide: ['$totalConsulted', '$totalPatients'] }, 100] },
                    ],
                },
                avgWaitingTime: { $round: ['$avgWaitingTime', 1] },
                avgEfficiencyScore: { $round: ['$avgEfficiencyScore', 1] },
                avgSatisfactionScore: { $round: ['$avgSatisfactionScore', 2] },
            },
        },
    ]);

    const dailyStats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$queueDate' } },
                count: { $sum: 1 },
                patients: { $sum: '$totalPatients' },
                consulted: { $sum: '$patientsConsulted' },
                avgWaitingTime: { $avg: '$averageWaitingTime' },
            },
        },
        {
            $project: {
                date: '$_id',
                count: 1,
                patients: 1,
                consulted: 1,
                consultationRate: {
                    $cond: [
                        { $eq: ['$patients', 0] },
                        0,
                        { $multiply: [{ $divide: ['$consulted', '$patients'] }, 100] },
                    ],
                },
                avgWaitingTime: { $round: ['$avgWaitingTime', 1] },
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
                patients: { $sum: '$totalPatients' },
                consulted: { $sum: '$patientsConsulted' },
                avgWaitingTime: { $avg: '$averageWaitingTime' },
                avgEfficiencyScore: { $avg: '$efficiencyScore' },
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
                patients: 1,
                consulted: 1,
                consultationRate: {
                    $cond: [
                        { $eq: ['$patients', 0] },
                        0,
                        { $multiply: [{ $divide: ['$consulted', '$patients'] }, 100] },
                    ],
                },
                avgWaitingTime: { $round: ['$avgWaitingTime', 1] },
                avgEfficiencyScore: { $round: ['$avgEfficiencyScore', 1] },
                _id: 0,
            },
        },
        { $sort: { patients: -1 } },
        { $limit: 10 },
    ]);

    return {
        ...(stats[0] || {}),
        dailyStats: dailyStats.reverse(),
        topDoctors: doctorStats,
    };
};

/**
 * Export Queue model
 */
module.exports = mongoose.model('Queue', queueSchema);