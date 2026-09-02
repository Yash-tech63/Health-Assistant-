const Notification = require('../models/Notification');
const socketManager = require('../config/socket');

/**
 * Notification Service
 */
class NotificationService {
    /**
     * Create and send notification
     */
    async createNotification(userId, data) {
        try {
            const notification = await Notification.create({
                user: userId,
                ...data,
                sentAt: Date.now(),
            });

            // Send real-time notification via Socket.IO
            if (process.env.ENABLE_SOCKET_REALTIME === 'true') {
                socketManager.emitToUser(userId, 'newNotification', {
                    notification: notification,
                });
            }

            // TODO: Send via other channels (email, SMS, push) based on user preferences
            // This would integrate with email service, SMS gateway, push notification service

            return notification;
        } catch (error) {
            console.error('Notification creation error:', error);
            throw error;
        }
    }

    /**
     * Create appointment notification
     */
    async createAppointmentNotification(userId, appointment, type = 'reminder') {
        const notificationTypes = {
            booked: {
                title: 'Appointment Booked',
                message: `Your appointment with Dr. ${appointment.doctor.doctorName} is booked for ${appointment.appointmentDate}`,
            },
            reminder: {
                title: 'Appointment Reminder',
                message: `Reminder: Your appointment is scheduled for tomorrow at ${appointment.appointmentTime}`,
            },
            cancelled: {
                title: 'Appointment Cancelled',
                message: `Your appointment with Dr. ${appointment.doctor.doctorName} has been cancelled`,
            },
            confirmed: {
                title: 'Appointment Confirmed',
                message: `Your appointment with Dr. ${appointment.doctor.doctorName} is confirmed`,
            },
        };

        const notificationData = notificationTypes[type] || notificationTypes.reminder;

        return await this.createNotification(userId, {
            title: notificationData.title,
            message: notificationData.message,
            type: 'appointment',
            referenceType: 'appointment',
            referenceId: appointment._id,
            actionRequired: type === 'reminder',
            actionType: type === 'reminder' ? 'confirm' : null,
            priority: type === 'reminder' ? 'high' : 'medium',
            channels: ['in_app', 'push'],
            metadata: {
                appointmentId: appointment._id,
                doctorName: appointment.doctor.doctorName,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                facilityName: appointment.facility.name,
            },
        });
    }

    /**
     * Create medication reminder
     */
    async createMedicationReminder(userId, medication, prescription) {
        return await this.createNotification(userId, {
            title: 'Medication Reminder',
            message: `Time to take ${medication.medicineName} - ${medication.dosage}`,
            type: 'medication',
            referenceType: 'prescription',
            referenceId: prescription._id,
            actionRequired: true,
            actionType: 'acknowledge',
            priority: 'medium',
            channels: ['in_app', 'push'],
            metadata: {
                prescriptionId: prescription._id,
                medicineName: medication.medicineName,
                dosage: medication.dosage,
                frequency: medication.frequency,
            },
        });
    }

    /**
     * Create queue notification
     */
    async createQueueNotification(userId, queueData) {
        return await this.createNotification(userId, {
            title: 'Queue Update',
            message: `Your queue position is ${queueData.position}. Estimated wait time: ${queueData.estimatedWaitingTime} minutes`,
            type: 'queue',
            referenceType: 'queue',
            referenceId: queueData.queueId,
            actionRequired: false,
            priority: 'medium',
            channels: ['in_app'],
            metadata: {
                queueId: queueData.queueId,
                position: queueData.position,
                estimatedWaitingTime: queueData.estimatedWaitingTime,
                currentToken: queueData.currentToken,
            },
        });
    }

    /**
     * Create high-risk patient alert
     */
    async createHighRiskAlert(userId, assessment) {
        return await this.createNotification(userId, {
            title: 'High Risk Alert',
            message: `Your symptom assessment indicates ${assessment.riskLevel} risk level. ${assessment.recommendation}`,
            type: 'high_risk',
            referenceType: 'symptom_assessment',
            referenceId: assessment._id,
            actionRequired: true,
            actionType: 'follow_up',
            priority: 'critical',
            channels: ['in_app', 'sms', 'push'],
            metadata: {
                assessmentId: assessment._id,
                riskLevel: assessment.riskLevel,
                recommendation: assessment.recommendation,
                recommendedAction: assessment.recommendedAction,
            },
        });
    }

    /**
     * Create lab report notification
     */
    async createLabReportNotification(userId, labReport) {
        return await this.createNotification(userId, {
            title: 'Lab Report Ready',
            message: `Your ${labReport.testName} report is now available`,
            type: 'lab_report',
            referenceType: 'lab_report',
            referenceId: labReport._id,
            actionRequired: true,
            actionType: 'review',
            priority: 'medium',
            channels: ['in_app', 'email'],
            metadata: {
                labReportId: labReport._id,
                testName: labReport.testName,
                reportDate: labReport.reportDate,
                hasCriticalValues: labReport.hasCriticalValues,
            },
        });
    }

    /**
     * Create referral notification
     */
    async createReferralNotification(userId, referral, type = 'created') {
        const notificationTypes = {
            created: {
                title: 'Referral Created',
                message: `A referral has been created for you to ${referral.targetFacility.name}`,
            },
            accepted: {
                title: 'Referral Accepted',
                message: `Your referral to ${referral.targetFacility.name} has been accepted`,
            },
            appointment: {
                title: 'Referral Appointment',
                message: `An appointment has been scheduled for your referral`,
            },
        };

        const notificationData = notificationTypes[type] || notificationTypes.created;

        return await this.createNotification(userId, {
            title: notificationData.title,
            message: notificationData.message,
            type: 'referral',
            referenceType: 'referral',
            referenceId: referral._id,
            actionRequired: type === 'created',
            actionType: type === 'created' ? 'acknowledge' : null,
            priority: type === 'created' ? 'high' : 'medium',
            channels: ['in_app', 'sms'],
            metadata: {
                referralId: referral._id,
                referringFacility: referral.referringFacility.name,
                targetFacility: referral.targetFacility.name,
                reason: referral.reasonForReferral,
                status: referral.status,
            },
        });
    }

    /**
     * Get user notifications
     */
    async getUserNotifications(userId, filters = {}) {
        const { page = 1, limit = 20, isRead, type, priority } = filters;
        const skip = (page - 1) * limit;

        const query = { user: userId };

        if (isRead !== undefined) {
            query.isRead = isRead;
        }

        if (type) {
            query.type = type;
        }

        if (priority) {
            query.priority = priority;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments(query);

        return {
            notifications,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId, userId) {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId },
            { isRead: true, readAt: Date.now() },
            { new: true }
        );

        if (!notification) {
            throw new Error('Notification not found or unauthorized');
        }

        return notification;
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId) {
        const result = await Notification.updateMany(
            { user: userId, isRead: false },
            { isRead: true, readAt: Date.now() }
        );

        return {
            modifiedCount: result.modifiedCount,
            message: `${result.modifiedCount} notifications marked as read`,
        };
    }

    /**
     * Delete notification
     */
    async deleteNotification(notificationId, userId) {
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            user: userId,
        });

        if (!notification) {
            throw new Error('Notification not found or unauthorized');
        }

        return notification;
    }

    /**
     * Get notification statistics
     */
    async getNotificationStats(userId) {
        const stats = await Notification.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    unread: {
                        $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] },
                    },
                    byType: {
                        $push: {
                            type: '$type',
                            count: 1,
                        },
                    },
                    byPriority: {
                        $push: {
                            priority: '$priority',
                            count: 1,
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    unread: 1,
                    read: { $subtract: ['$total', '$unread'] },
                    byType: {
                        $reduce: {
                            input: '$byType',
                            initialValue: [],
                            in: {
                                $concatArrays: [
                                    '$$value',
                                    [
                                        {
                                            $cond: [
                                                { $in: ['$$this.type', '$$value.type'] },
                                                {},
                                                {
                                                    type: '$$this.type',
                                                    count: {
                                                        $sum: {
                                                            $map: {
                                                                input: {
                                                                    $filter: {
                                                                        input: '$byType',
                                                                        cond: { $eq: ['$$this.type', '$$this.type'] },
                                                                    },
                                                                },
                                                                in: '$$this.count',
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    byPriority: {
                        $reduce: {
                            input: '$byPriority',
                            initialValue: [],
                            in: {
                                $concatArrays: [
                                    '$$value',
                                    [
                                        {
                                            $cond: [
                                                { $in: ['$$this.priority', '$$value.priority'] },
                                                {},
                                                {
                                                    priority: '$$this.priority',
                                                    count: {
                                                        $sum: {
                                                            $map: {
                                                                input: {
                                                                    $filter: {
                                                                        input: '$byPriority',
                                                                        cond: { $eq: ['$$this.priority', '$$this.priority'] },
                                                                    },
                                                                },
                                                                in: '$$this.count',
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
            },
        ]);

        return stats[0] || {
            total: 0,
            unread: 0,
            read: 0,
            byType: [],
            byPriority: [],
        };
    }

    /**
     * Clean up old notifications (for cron job)
     */
    async cleanupOldNotifications(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const result = await Notification.deleteMany({
            createdAt: { $lt: cutoffDate },
            isRead: true,
            priority: { $in: ['low', 'medium'] },
        });

        return {
            deletedCount: result.deletedCount,
            message: `Cleaned up ${result.deletedCount} notifications older than ${days} days`,
        };
    }

    /**
     * Send scheduled notifications (for cron job)
     */
    async sendScheduledNotifications() {
        const now = new Date();
        const notifications = await Notification.find({
            status: 'scheduled',
            scheduledFor: { $lte: now },
        }).limit(100); // Batch size

        const results = [];

        for (const notification of notifications) {
            try {
                // Update status to sent
                notification.status = 'sent';
                notification.sentAt = Date.now();
                await notification.save();

                // Send via Socket.IO
                if (process.env.ENABLE_SOCKET_REALTIME === 'true') {
                    socketManager.emitToUser(notification.user.toString(), 'newNotification', {
                        notification: notification,
                    });
                }

                results.push({
                    notificationId: notification._id,
                    success: true,
                    sentAt: notification.sentAt,
                });
            } catch (error) {
                console.error(`Failed to send notification ${notification._id}:`, error);
                results.push({
                    notificationId: notification._id,
                    success: false,
                    error: error.message,
                });
            }
        }

        return {
            processed: notifications.length,
            results,
        };
    }
}

// Singleton instance
const notificationService = new NotificationService();
module.exports = notificationService;