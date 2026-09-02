const SymptomAssessment = require('../models/SymptomAssessment');
const notificationService = require('./notificationService');
const ApiError = require('../utils/ApiError');

/**
 * Symptom Triage Service
 */
class SymptomTriageService {
    constructor() {
        // Emergency symptoms that require immediate attention
        this.emergencySymptoms = [
            'chest pain',
            'severe breathing difficulty',
            'unconsciousness',
            'heavy bleeding',
            'stroke',
            'heart attack',
            'severe head injury',
            'poisoning',
            'severe burn',
            'seizure',
            'sudden paralysis',
            'severe allergic reaction',
            'suicidal thoughts',
            'severe abdominal pain',
        ];

        // High-risk symptoms
        this.highRiskSymptoms = [
            'persistent high fever',
            'severe dehydration',
            'severe pain',
            'confusion',
            'dizziness',
            'rapid heartbeat',
            'difficulty speaking',
            'vision problems',
            'severe vomiting',
            'severe diarrhea',
            'blood in stool',
            'blood in urine',
            'difficulty swallowing',
            'severe rash',
        ];

        // Medium-risk symptoms
        this.mediumRiskSymptoms = [
            'moderate fever',
            'cough',
            'sore throat',
            'headache',
            'body aches',
            'fatigue',
            'nausea',
            'mild pain',
            'mild rash',
            'runny nose',
            'congestion',
            'mild diarrhea',
            'mild vomiting',
        ];

        // Low-risk symptoms
        this.lowRiskSymptoms = [
            'mild cold',
            'mild headache',
            'mild fatigue',
            'mild cough',
            'minor cuts',
            'mild bruising',
            'mild itching',
            'mild stomach upset',
            'mild constipation',
            'mild heartburn',
        ];
    }

    /**
     * Assess symptoms and determine risk level
     */
    async assessSymptoms(patientId, symptomData, createdBy) {
        try {
            const { symptoms, duration, severity, language = 'en' } = symptomData;

            // Convert symptoms to lowercase for matching
            const symptomsLower = symptoms.map(s => s.toLowerCase());

            // Determine risk level based on symptoms
            const riskLevel = this.determineRiskLevel(symptomsLower);
            const riskScore = this.calculateRiskScore(symptomsLower, duration, severity);

            // Generate recommendation based on risk level
            const recommendation = this.generateRecommendation(riskLevel, symptomsLower, duration);

            // Create symptom assessment record
            const assessment = await SymptomAssessment.create({
                patient: patientId,
                symptoms: symptoms.map((symptom, index) => ({
                    symptom,
                    severity,
                    duration: {
                        value: parseInt(duration) || 1,
                        unit: 'days',
                    },
                })),
                chiefComplaint: symptoms.join(', '),
                durationText: `${duration} days`,
                severityText: severity,
                riskLevel,
                riskScore,
                recommendation,
                recommendedAction: this.getRecommendedAction(riskLevel),
                recommendedTimeline: this.getRecommendedTimeline(riskLevel),
                language,
                disclaimerAccepted: true,
                status: 'completed',
                createdBy,
            });

            // Handle high-risk and emergency cases
            if (riskLevel === 'high' || riskLevel === 'emergency') {
                await this.handleHighRiskCase(assessment, patientId);
            }

            // Create notification for the patient
            await notificationService.createNotification(patientId, {
                title: 'Symptom Assessment Complete',
                message: `Your symptom assessment indicates ${riskLevel} risk level. ${recommendation}`,
                type: 'high_risk',
                referenceType: 'symptom_assessment',
                referenceId: assessment._id,
                priority: riskLevel === 'emergency' ? 'critical' : 'high',
                channels: ['in_app'],
                metadata: {
                    assessmentId: assessment._id,
                    riskLevel,
                    recommendation,
                },
            });

            return assessment;
        } catch (error) {
            console.error('Symptom assessment error:', error);
            throw error;
        }
    }

    /**
     * Determine risk level based on symptoms
     */
    determineRiskLevel(symptoms) {
        // Check for emergency symptoms
        for (const symptom of symptoms) {
            if (this.emergencySymptoms.some(es => symptom.includes(es) || es.includes(symptom))) {
                return 'emergency';
            }
        }

        // Check for high-risk symptoms
        for (const symptom of symptoms) {
            if (this.highRiskSymptoms.some(hs => symptom.includes(hs) || hs.includes(symptom))) {
                return 'high';
            }
        }

        // Check for medium-risk symptoms
        for (const symptom of symptoms) {
            if (this.mediumRiskSymptoms.some(ms => symptom.includes(ms) || ms.includes(symptom))) {
                return 'medium';
            }
        }

        // Default to low risk
        return 'low';
    }

    /**
     * Calculate risk score (0-100)
     */
    calculateRiskScore(symptoms, duration, severity) {
        let score = 0;

        // Base score based on number of symptoms
        score += symptoms.length * 5;

        // Duration factor (longer duration = higher risk)
        const durationDays = parseInt(duration) || 1;
        if (durationDays > 7) score += 20;
        else if (durationDays > 3) score += 10;
        else if (durationDays > 1) score += 5;

        // Severity factor
        if (severity === 'severe') score += 30;
        else if (severity === 'moderate') score += 15;
        else if (severity === 'mild') score += 5;

        // Symptom-specific scoring
        for (const symptom of symptoms) {
            if (this.emergencySymptoms.some(es => symptom.includes(es) || es.includes(symptom))) {
                score += 40;
            } else if (this.highRiskSymptoms.some(hs => symptom.includes(hs) || hs.includes(symptom))) {
                score += 25;
            } else if (this.mediumRiskSymptoms.some(ms => symptom.includes(ms) || ms.includes(symptom))) {
                score += 15;
            } else {
                score += 5;
            }
        }

        // Cap score at 100
        return Math.min(100, score);
    }

    /**
     * Generate recommendation based on risk level
     */
    generateRecommendation(riskLevel, symptoms, duration) {
        const recommendations = {
            emergency: 'Seek emergency medical attention immediately. Call emergency services or go to the nearest emergency room.',
            high: 'Consult a healthcare professional urgently within 24 hours. Your symptoms require prompt medical evaluation.',
            medium: 'Schedule an appointment with a healthcare provider within 48 hours. Monitor your symptoms and seek care if they worsen.',
            low: 'Self-care is recommended. Rest, stay hydrated, and monitor your symptoms. Seek medical attention if symptoms persist or worsen.',
        };

        let recommendation = recommendations[riskLevel];

        // Add specific advice based on symptoms
        if (symptoms.some(s => s.includes('fever'))) {
            recommendation += ' For fever, maintain hydration and monitor temperature.';
        }

        if (symptoms.some(s => s.includes('cough') || s.includes('breathing'))) {
            recommendation += ' If experiencing breathing difficulties, seek immediate care.';
        }

        if (symptoms.some(s => s.includes('pain'))) {
            recommendation += ' For pain management, consider over-the-counter pain relief as directed.';
        }

        return recommendation;
    }

    /**
     * Get recommended action based on risk level
     */
    getRecommendedAction(riskLevel) {
        const actions = {
            emergency: 'emergency_room',
            high: 'urgent_care',
            medium: 'clinic_visit',
            low: 'self_care',
        };

        return actions[riskLevel];
    }

    /**
     * Get recommended timeline based on risk level
     */
    getRecommendedTimeline(riskLevel) {
        const timelines = {
            emergency: 'immediately',
            high: 'within_24_hours',
            medium: 'within_48_hours',
            low: 'routine',
        };

        return timelines[riskLevel];
    }

    /**
     * Handle high-risk cases
     */
    async handleHighRiskCase(assessment, patientId) {
        try {
            // Mark assessment as needing escalation
            assessment.needsEscalation = true;
            await assessment.save();

            // Create high-risk alert notification
            await notificationService.createHighRiskAlert(patientId, assessment);

            // TODO: In a real system, this would:
            // 1. Notify healthcare workers/doctors
            // 2. Create follow-up task
            // 3. Schedule automatic check-in
            // 4. Potentially create emergency referral

            console.log(`⚠️ High-risk case identified for patient ${patientId}`);
            console.log(`   Risk Level: ${assessment.riskLevel}`);
            console.log(`   Symptoms: ${assessment.symptoms.map(s => s.symptom).join(', ')}`);
            console.log(`   Recommendation: ${assessment.recommendation}`);

        } catch (error) {
            console.error('High-risk case handling error:', error);
        }
    }

    /**
     * Get symptom assessment by ID
     */
    async getAssessmentById(assessmentId, userId) {
        const assessment = await SymptomAssessment.findById(assessmentId)
            .populate('patient', 'fullName dateOfBirth gender')
            .populate('createdBy', 'name role');

        if (!assessment) {
            throw ApiError.notFound('Assessment not found');
        }

        // Check authorization
        // TODO: Implement proper authorization logic

        return assessment;
    }

    /**
     * Get patient's symptom assessment history
     */
    async getPatientAssessments(patientId, filters = {}) {
        const { page = 1, limit = 10, riskLevel } = filters;
        const skip = (page - 1) * limit;

        const query = { patient: patientId };

        if (riskLevel) {
            query.riskLevel = riskLevel;
        }

        const assessments = await SymptomAssessment.find(query)
            .sort({ assessmentDate: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name role');

        const total = await SymptomAssessment.countDocuments(query);

        return {
            assessments,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get symptom statistics
     */
    async getSymptomStatistics(facilityId = null, startDate = null, endDate = null) {
        const matchStage = {};

        if (facilityId) {
            // TODO: Implement facility filtering if needed
        }

        if (startDate && endDate) {
            matchStage.assessmentDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const stats = await SymptomAssessment.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalAssessments: { $sum: 1 },
                    emergencyCount: {
                        $sum: { $cond: [{ $eq: ['$riskLevel', 'emergency'] }, 1, 0] },
                    },
                    highCount: {
                        $sum: { $cond: [{ $eq: ['$riskLevel', 'high'] }, 1, 0] },
                    },
                    mediumCount: {
                        $sum: { $cond: [{ $eq: ['$riskLevel', 'medium'] }, 1, 0] },
                    },
                    lowCount: {
                        $sum: { $cond: [{ $eq: ['$riskLevel', 'low'] }, 1, 0] },
                    },
                    avgRiskScore: { $avg: '$riskScore' },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalAssessments: 1,
                    emergencyCount: 1,
                    highCount: 1,
                    mediumCount: 1,
                    lowCount: 1,
                    emergencyPercentage: {
                        $cond: [
                            { $eq: ['$totalAssessments', 0] },
                            0,
                            { $multiply: [{ $divide: ['$emergencyCount', '$totalAssessments'] }, 100] },
                        ],
                    },
                    highPercentage: {
                        $cond: [
                            { $eq: ['$totalAssessments', 0] },
                            0,
                            { $multiply: [{ $divide: ['$highCount', '$totalAssessments'] }, 100] },
                        ],
                    },
                    avgRiskScore: { $round: ['$avgRiskScore', 2] },
                },
            },
        ]);

        const symptomStats = await SymptomAssessment.aggregate([
            { $match: matchStage },
            { $unwind: '$symptoms' },
            {
                $group: {
                    _id: '$symptoms.symptom',
                    count: { $sum: 1 },
                    avgRiskLevel: {
                        $avg: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$riskLevel', 'emergency'] }, then: 4 },
                                    { case: { $eq: ['$riskLevel', 'high'] }, then: 3 },
                                    { case: { $eq: ['$riskLevel', 'medium'] }, then: 2 },
                                    { case: { $eq: ['$riskLevel', 'low'] }, then: 1 },
                                ],
                                default: 0,
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    symptom: '$_id',
                    count: 1,
                    avgRiskLevel: { $round: ['$avgRiskLevel', 2] },
                    _id: 0,
                },
            },
            { $sort: { count: -1 } },
            { $limit: 20 },
        ]);

        return {
            ...(stats[0] || {}),
            topSymptoms: symptomStats,
        };
    }

    /**
     * Get common symptom combinations
     */
    async getSymptomCombinations() {
        const combinations = await SymptomAssessment.aggregate([
            { $unwind: '$symptoms' },
            {
                $group: {
                    _id: '$patient',
                    symptoms: { $push: '$symptoms.symptom' },
                    riskLevel: { $first: '$riskLevel' },
                },
            },
            {
                $project: {
                    symptomCount: { $size: '$symptoms' },
                    symptoms: 1,
                    riskLevel: 1,
                },
            },
            { $match: { symptomCount: { $gt: 1 } } },
            { $limit: 50 },
        ]);

        return combinations;
    }

    /**
     * Update assessment with follow-up information
     */
    async updateAssessmentFollowUp(assessmentId, followUpData) {
        const assessment = await SymptomAssessment.findById(assessmentId);

        if (!assessment) {
            throw ApiError.notFound('Assessment not found');
        }

        if (followUpData.followUpRequired !== undefined) {
            assessment.followUpRequired = followUpData.followUpRequired;
        }

        if (followUpData.followUpDate) {
            assessment.followUpDate = followUpData.followUpDate;
        }

        if (followUpData.followUpInstructions) {
            assessment.followUpInstructions = followUpData.followUpInstructions;
        }

        if (followUpData.appointmentCreated) {
            assessment.appointmentCreated = followUpData.appointmentCreated;
        }

        if (followUpData.referralCreated) {
            assessment.referralCreated = followUpData.referralCreated;
        }

        if (followUpData.status) {
            assessment.status = followUpData.status;
        }

        await assessment.save();
        return assessment;
    }
}

// Singleton instance
const symptomTriageService = new SymptomTriageService();
module.exports = symptomTriageService;