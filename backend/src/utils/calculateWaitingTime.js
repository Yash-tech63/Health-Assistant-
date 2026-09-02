/**
 * Calculate waiting time for queue
 */
class WaitingTimeCalculator {
    /**
     * Calculate waiting time based on patients ahead
     */
    static calculate(patientsAhead, averageConsultationMinutes = 15) {
        if (patientsAhead <= 0) return 0;

        // Basic calculation: patients ahead × average consultation time
        const baseWaitingTime = patientsAhead * averageConsultationMinutes;

        // Add buffer for variability
        const buffer = Math.floor(baseWaitingTime * 0.2); // 20% buffer

        return baseWaitingTime + buffer;
    }

    /**
     * Calculate waiting time for doctor's queue
     */
    static calculateForDoctor(queueLength, currentToken, doctorSettings = {}) {
        const avgConsultationTime = doctorSettings.averageConsultationTime || 15;
        const patientsAhead = queueLength;

        return this.calculate(patientsAhead, avgConsultationTime);
    }

    /**
     * Format waiting time for display
     */
    static formatMinutes(minutes) {
        if (minutes <= 0) return 'Now';

        if (minutes < 60) {
            return `${minutes} minutes`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        }

        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }

    /**
     * Estimate consultation end time
     */
    static estimateEndTime(waitingMinutes) {
        const now = new Date();
        const endTime = new Date(now.getTime() + waitingMinutes * 60000);

        return {
            waitingMinutes,
            estimatedEndTime: endTime,
            formattedEndTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
    }

    /**
     * Calculate batch waiting times
     */
    static calculateBatch(queuePositions, settings = {}) {
        const results = {};
        const avgTime = settings.averageConsultationTime || 15;

        for (const [queueId, position] of Object.entries(queuePositions)) {
            const waitingTime = this.calculate(position, avgTime);
            results[queueId] = {
                position,
                waitingMinutes: waitingTime,
                formattedWaitingTime: this.formatMinutes(waitingTime),
                ...this.estimateEndTime(waitingTime),
            };
        }

        return results;
    }
}

module.exports = WaitingTimeCalculator;