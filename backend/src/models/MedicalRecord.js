const mongoose = require('mongoose');

/**
 * Medical Record Schema
 */
const medicalRecordSchema = new mongoose.Schema({
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

    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [true, 'Appointment is required'],
    },

    // Record Information
    recordType: {
        type: String,
        enum: ['consultation', 'follow_up', 'emergency', 'admission', 'discharge', 'procedure', 'test_result'],
        default: 'consultation',
    },

    consultationDate: {
        type: Date,
        required: [true, 'Consultation date is required'],
        default: Date.now,
    },

    // Clinical Information
    chiefComplaint: {
        type: String,
        required: [true, 'Chief complaint is required'],
        trim: true,
        maxlength: [500, 'Chief complaint cannot exceed 500 characters'],
    },

    historyOfPresentIllness: {
        type: String,
        trim: true,
        maxlength: [2000, 'History cannot exceed 2000 characters'],
    },

    // Vital Signs
    vitalSigns: {
        bloodPressure: {
            systolic: Number,
            diastolic: Number,
        },
        pulseRate: {
            type: Number,
            min: [30, 'Pulse rate must be at least 30 bpm'],
            max: [200, 'Pulse rate cannot exceed 200 bpm'],
        },
        respiratoryRate: {
            type: Number,
            min: [8, 'Respiratory rate must be at least 8 breaths/min'],
            max: [60, 'Respiratory rate cannot exceed 60 breaths/min'],
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
        height: Number, // in cm
        weight: Number, // in kg
        bmi: Number,
        recordedAt: {
            type: Date,
            default: Date.now,
        },
    },

    // Physical Examination
    physicalExamination: {
        generalAppearance: String,
        cardiovascular: String,
        respiratory: String,
        abdominal: String,
        neurological: String,
        musculoskeletal: String,
        dermatological: String,
        other: String,
    },

    // Diagnosis
    provisionalDiagnosis: [{
        code: String, // ICD-10 code
        description: {
            type: String,
            required: true,
            trim: true,
        },
        certainty: {
            type: String,
            enum: ['suspected', 'probable', 'confirmed'],
            default: 'suspected',
        },
    }],

    finalDiagnosis: [{
        code: String, // ICD-10 code
        description: {
            type: String,
            required: true,
            trim: true,
        },
        confirmedAt: {
            type: Date,
            default: Date.now,
        },
    }],

    // Investigations Ordered
    investigationsOrdered: [{
        testName: {
            type: String,
            required: true,
            trim: true,
        },
        testType: {
            type: String,
            enum: ['blood', 'urine', 'imaging', 'ecg', 'ultrasound', 'xray', 'mri', 'ct', 'other'],
            required: true,
        },
        reason: String,
        status: {
            type: String,
            enum: ['ordered', 'in_progress', 'completed', 'cancelled'],
            default: 'ordered',
        },
        labReport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LabReport',
            default: null,
        },
    }],

    // Treatment Plan
    treatmentPlan: {
        medications: [{
            medicineName: {
                type: String,
                required: true,
                trim: true,
            },
            dosage: String,
            frequency: String,
            duration: String,
            route: {
                type: String,
                enum: ['oral', 'iv', 'im', 'sc', 'topical', 'inhalation', 'other'],
                default: 'oral',
            },
            instructions: String,
        }],

        procedures: [{
            name: String,
            description: String,
            scheduledDate: Date,
            status: {
                type: String,
                enum: ['scheduled', 'completed', 'cancelled'],
                default: 'scheduled',
            },
        }],

        lifestyleAdvice: [{
            type: String,
            trim: true,
        }],

        followUpInstructions: String,

        nextVisitDate: Date,

        referralNeeded: {
            type: Boolean,
            default: false,
        },

        referralDetails: String,
    },

    // Prescription Reference
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        default: null,
    },

    // Admission Details (if applicable)
    admissionDetails: {
        admissionDate: Date,
        dischargeDate: Date,
        ward: String,
        bedNumber: String,
        dischargeSummary: String,
    },

    // Procedure Details (if applicable)
    procedureDetails: {
        procedureName: String,
        procedureDate: Date,
        anesthesiaType: String,
        duration: Number, // in minutes
        findings: String,
        complications: String,
        postProcedureInstructions: String,
    },

    // Referral Information
    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referral',
        default: null,
    },

    // Clinical Notes
    clinicalNotes: {
        type: String,
        trim: true,
        maxlength: [5000, 'Clinical notes cannot exceed 5000 characters'],
    },

    // Assessment and Plan
    assessment: {
        type: String,
        trim: true,
        maxlength: [2000, 'Assessment cannot exceed 2000 characters'],
    },

    plan: {
        type: String,
        trim: true,
        maxlength: [2000, 'Plan cannot exceed 2000 characters'],
    },

    // Risk Assessment
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency', null],
        default: null,
    },

    riskFactors: [String],

    riskMitigationPlan: String,

    // Patient Education
    patientEducation: {
        topics: [String],
        materialsProvided: [String],
        understandingConfirmed: {
            type: Boolean,
            default: false,
        },
    },

    // Consent Management
    consentTaken: {
        type: Boolean,
        default: false,
    },

    consentType: String,

    consentNotes: String,

    // Document Attachments
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    }],

    // Status and Visibility
    status: {
        type: String,
        enum: ['draft', 'finalized', 'archived', 'deleted'],
        default: 'draft',
    },

    isConfidential: {
        type: Boolean,
        default: false,
    },

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

    finalizedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },

    finalizedAt: Date,

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
 * Virtual for age at consultation
 */
medicalRecordSchema.virtual('patientAgeAtConsultation').get(function () {
    if (!this.patient || !this.consultationDate) return null;

    // This would require population to work
    return null;
});

/**
 * Virtual for record summary
 */
medicalRecordSchema.virtual('summary').get(function () {
    return {
        chiefComplaint: this.chiefComplaint,
        diagnosis: this.finalDiagnosis.length > 0
            ? this.finalDiagnosis.map(d => d.description).join(', ')
            : this.provisionalDiagnosis.map(d => d.description).join(', '),
        treatmentPlan: this.treatmentPlan.medications.length > 0
            ? `${this.treatmentPlan.medications.length} medications prescribed`
            : 'No medications prescribed',
        followUp: this.treatmentPlan.nextVisitDate ? 'Yes' : 'No',
        riskLevel: this.riskLevel,
    };
});

/**
 * Indexes
 */
medicalRecordSchema.index({ patient: 1, consultationDate: -1 });
medicalRecordSchema.index({ doctor: 1, consultationDate: -1 });
medicalRecordSchema.index({ facility: 1, consultationDate: -1 });
medicalRecordSchema.index({ appointment: 1 }, { unique: true });
medicalRecordSchema.index({ status: 1 });
medicalRecordSchema.index({ recordType: 1 });
medicalRecordSchema.index({ riskLevel: 1 });
medicalRecordSchema.index({ 'provisionalDiagnosis.code': 1 });
medicalRecordSchema.index({ 'finalDiagnosis.code': 1 });
medicalRecordSchema.index({ createdAt: -1 });

/**
 * Text search index
 */
medicalRecordSchema.index({
    'chiefComplaint': 'text',
    'historyOfPresentIllness': 'text',
    'clinicalNotes': 'text',
    'assessment': 'text',
    'plan': 'text',
    'provisionalDiagnosis.description': 'text',
    'finalDiagnosis.description': 'text',
});

/**
 * Pre-save middleware
 */
medicalRecordSchema.pre('save', function (next) {
    // Update updatedAt timestamp
    this.updatedAt = Date.now();

    // Calculate BMI if height and weight are provided
    if (this.vitalSigns.height && this.vitalSigns.weight) {
        const heightInMeters = this.vitalSigns.height / 100;
        this.vitalSigns.bmi = this.vitalSigns.weight / (heightInMeters * heightInMeters);
    }

    // Auto-finalize if not in draft and finalizedAt not set
    if (this.status === 'finalized' && !this.finalizedAt) {
        this.finalizedAt = Date.now();
    }

    next();
});

/**
 * Method to finalize record
 */
medicalRecordSchema.methods.finalizeRecord = function (userId) {
    if (this.status === 'finalized') {
        throw new Error('Record is already finalized');
    }

    this.status = 'finalized';
    this.finalizedBy = userId;
    this.finalizedAt = Date.now();

    return this.save();
};

/**
 * Method to update diagnosis
 */
medicalRecordSchema.methods.updateDiagnosis = function (provisional = [], final = []) {
    if (this.status === 'finalized') {
        throw new Error('Cannot update diagnosis on finalized record');
    }

    if (provisional.length > 0) {
        this.provisionalDiagnosis = provisional;
    }

    if (final.length > 0) {
        this.finalDiagnosis = final.map(diagnosis => ({
            ...diagnosis,
            confirmedAt: Date.now(),
        }));
    }

    return this.save();
};

/**
 * Method to add investigation
 */
medicalRecordSchema.methods.addInvestigation = function (investigationData) {
    if (this.status === 'finalized') {
        throw new Error('Cannot add investigation to finalized record');
    }

    this.investigationsOrdered.push(investigationData);
    return this.save();
};

/**
 * Method to update investigation status
 */
medicalRecordSchema.methods.updateInvestigationStatus = function (investigationIndex, status, labReportId = null) {
    if (investigationIndex < 0 || investigationIndex >= this.investigationsOrdered.length) {
        throw new Error('Invalid investigation index');
    }

    this.investigationsOrdered[investigationIndex].status = status;

    if (labReportId) {
        this.investigationsOrdered[investigationIndex].labReport = labReportId;
    }

    return this.save();
};

/**
 * Method to add medication to treatment plan
 */
medicalRecordSchema.methods.addMedication = function (medicationData) {
    if (this.status === 'finalized') {
        throw new Error('Cannot add medication to finalized record');
    }

    this.treatmentPlan.medications.push(medicationData);
    return this.save();
};

/**
 * Method to add attachment
 */
medicalRecordSchema.methods.addAttachment = function (attachmentData, userId) {
    attachmentData.uploadedAt = Date.now();
    attachmentData.uploadedBy = userId;

    this.attachments.push(attachmentData);
    return this.save();
};

/**
 * Method to update risk assessment
 */
medicalRecordSchema.methods.updateRiskAssessment = function (riskLevel, factors = [], mitigationPlan = '') {
    this.riskLevel = riskLevel;
    this.riskFactors = factors;
    this.riskMitigationPlan = mitigationPlan;

    return this.save();
};

/**
 * Method to confirm patient understanding
 */
medicalRecordSchema.methods.confirmPatientUnderstanding = function () {
    this.patientEducation.understandingConfirmed = true;
    return this.save();
};

/**
 * Method to generate discharge summary
 */
medicalRecordSchema.methods.generateDischargeSummary = function () {
    if (!this.admissionDetails || !this.admissionDetails.admissionDate) {
        throw new Error('Not an admission record');
    }

    const summary = {
        admissionDate: this.admissionDetails.admissionDate,
        dischargeDate: this.admissionDetails.dischargeDate || Date.now(),
        chiefComplaint: this.chiefComplaint,
        diagnosis: this.finalDiagnosis.map(d => d.description).join(', '),
        treatmentReceived: this.treatmentPlan.medications.map(m => m.medicineName).join(', '),
        procedures: this.procedureDetails ? this.procedureDetails.procedureName : 'None',
        dischargeInstructions: this.treatmentPlan.followUpInstructions,
        nextVisitDate: this.treatmentPlan.nextVisitDate,
    };

    this.admissionDetails.dischargeSummary = JSON.stringify(summary);
    return this.save();
};

/**
 * Static method to find by patient
 */
medicalRecordSchema.statics.findByPatient = function (patientId, filters = {}) {
    const query = {
        patient: patientId,
        status: { $ne: 'deleted' },
        ...filters
    };

    return this.find(query)
        .populate('doctor', 'doctorName specialization')
        .populate('facility', 'name facilityType')
        .populate('appointment', 'appointmentDate appointmentTime')
        .sort({ consultationDate: -1 });
};

/**
 * Static method to find by appointment
 */
medicalRecordSchema.statics.findByAppointment = function (appointmentId) {
    return this.findOne({ appointment: appointmentId })
        .populate('patient', 'fullName dateOfBirth gender')
        .populate('doctor', 'doctorName specialization')
        .populate('facility', 'name facilityType');
};

/**
 * Static method to search records
 */
medicalRecordSchema.statics.searchRecords = function (searchTerm, filters = {}) {
    const query = {
        $text: { $search: searchTerm },
        status: 'finalized',
        ...filters,
    };

    return this.find(query)
        .populate('patient', 'fullName')
        .populate('doctor', 'doctorName')
        .populate('facility', 'name')
        .sort({ score: { $meta: 'textScore' } })
        .limit(50);
};

/**
 * Static method to get medical record statistics
 */
medicalRecordSchema.statics.getStatistics = async function (facilityId = null, startDate = null, endDate = null) {
    const matchStage = { status: 'finalized' };

    if (facilityId) {
        matchStage.facility = facilityId;
    }

    if (startDate && endDate) {
        matchStage.consultationDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const stats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalRecords: { $sum: 1 },
                totalPatients: { $addToSet: '$patient' },
                avgMedicationsPerRecord: { $avg: { $size: '$treatmentPlan.medications' } },
                avgInvestigationsPerRecord: { $avg: { $size: '$investigationsOrdered' } },
                highRiskRecords: {
                    $sum: { $cond: [{ $eq: ['$riskLevel', 'high'] }, 1, 0] },
                },
                emergencyRecords: {
                    $sum: { $cond: [{ $eq: ['$riskLevel', 'emergency'] }, 1, 0] },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalRecords: 1,
                totalPatients: { $size: '$totalPatients' },
                avgMedicationsPerRecord: { $round: ['$avgMedicationsPerRecord', 1] },
                avgInvestigationsPerRecord: { $round: ['$avgInvestigationsPerRecord', 1] },
                highRiskRecords: 1,
                emergencyRecords: 1,
                highRiskPercentage: {
                    $cond: [
                        { $eq: ['$totalRecords', 0] },
                        0,
                        { $multiply: [{ $divide: ['$highRiskRecords', '$totalRecords'] }, 100] },
                    ],
                },
            },
        },
    ]);

    const diagnosisStats = await this.aggregate([
        { $match: matchStage },
        { $unwind: '$finalDiagnosis' },
        {
            $group: {
                _id: '$finalDiagnosis.code',
                description: { $first: '$finalDiagnosis.description' },
                count: { $sum: 1 },
                avgMedications: { $avg: { $size: '$treatmentPlan.medications' } },
            },
        },
        {
            $project: {
                code: '$_id',
                description: 1,
                count: 1,
                avgMedications: { $round: ['$avgMedications', 1] },
                _id: 0,
            },
        },
        { $sort: { count: -1 } },
        { $limit: 20 },
    ]);

    const monthlyStats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: {
                    year: { $year: '$consultationDate' },
                    month: { $month: '$consultationDate' },
                },
                count: { $sum: 1 },
                avgMedications: { $avg: { $size: '$treatmentPlan.medications' } },
                highRiskCount: {
                    $sum: { $cond: [{ $eq: ['$riskLevel', 'high'] }, 1, 0] },
                },
            },
        },
        {
            $project: {
                year: '$_id.year',
                month: '$_id.month',
                count: 1,
                avgMedications: { $round: ['$avgMedications', 1] },
                highRiskCount: 1,
                highRiskPercentage: {
                    $cond: [
                        { $eq: ['$count', 0] },
                        0,
                        { $multiply: [{ $divide: ['$highRiskCount', '$count'] }, 100] },
                    ],
                },
                _id: 0,
            },
        },
        { $sort: { year: -1, month: -1 } },
        { $limit: 12 },
    ]);

    return {
        ...(stats[0] || {}),
        topDiagnoses: diagnosisStats,
        monthlyTrends: monthlyStats.reverse(),
    };
};

/**
 * Export MedicalRecord model
 */
module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);