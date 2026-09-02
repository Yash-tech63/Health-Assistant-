const redisClient = require('../config/redis');
const generateOTP = require('../utils/generateOTP');
const ApiError = require('../utils/ApiError');

/**
 * OTP Service for phone verification
 */
class OTPService {
    constructor() {
        this.otpExpirySeconds = parseInt(process.env.OTP_EXPIRY_SECONDS) || 300; // 5 minutes
        this.resendCooldownSeconds = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60; // 1 minute
        this.maxOtpAttempts = parseInt(process.env.MAX_OTP_ATTEMPTS) || 3;
    }

    /**
     * Generate and store OTP for phone verification
     */
    async generateAndStoreOTP(phone) {
        try {
            // Check resend cooldown
            const cooldownKey = `otp:cooldown:${phone}`;
            const cooldownExists = await redisClient.exists(cooldownKey);

            if (cooldownExists) {
                throw ApiError.badRequest('Please wait before requesting new OTP');
            }

            // Generate OTP
            const otp = generateOTP(6);

            // Store OTP in Redis
            const otpKey = `otp:${phone}`;
            await redisClient.set(otpKey, {
                otp: otp,
                phone: phone,
                attempts: 0,
                generatedAt: Date.now(),
            }, this.otpExpirySeconds);

            // Set resend cooldown
            await redisClient.set(cooldownKey, { cooldown: true }, this.resendCooldownSeconds);

            // In production, you would send the OTP via SMS
            // For development, we'll log it
            if (process.env.NODE_ENV === 'development') {
                console.log(`📱 OTP for ${phone}: ${otp}`);
            }

            return {
                success: true,
                message: 'OTP generated successfully',
                otp: process.env.NODE_ENV === 'development' ? otp : null, // Don't return OTP in production
                expirySeconds: this.otpExpirySeconds,
            };
        } catch (error) {
            console.error('OTP generation error:', error);
            throw error;
        }
    }

    /**
     * Verify OTP
     */
    async verifyOTP(phone, otp) {
        try {
            const otpKey = `otp:${phone}`;
            const otpData = await redisClient.get(otpKey);

            if (!otpData) {
                throw ApiError.badRequest('OTP expired or not found');
            }

            // Check if OTP is already verified
            if (otpData.verified) {
                throw ApiError.badRequest('Phone already verified');
            }

            // Check OTP attempts
            if (otpData.attempts >= this.maxOtpAttempts) {
                // Delete OTP after max attempts
                await redisClient.del(otpKey);
                throw ApiError.badRequest('Maximum OTP attempts exceeded. Please request new OTP.');
            }

            // Verify OTP
            if (otpData.otp !== otp) {
                // Increment attempts
                otpData.attempts += 1;
                await redisClient.set(otpKey, otpData, this.otpExpirySeconds);

                const attemptsLeft = this.maxOtpAttempts - otpData.attempts;
                throw ApiError.badRequest(`Invalid OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left.`);
            }

            // Mark OTP as verified
            otpData.verified = true;
            otpData.verifiedAt = Date.now();
            await redisClient.set(otpKey, otpData, this.otpExpirySeconds);

            // Remove cooldown if exists
            const cooldownKey = `otp:cooldown:${phone}`;
            await redisClient.del(cooldownKey);

            return {
                success: true,
                message: 'Phone verified successfully',
                verifiedAt: otpData.verifiedAt,
            };
        } catch (error) {
            console.error('OTP verification error:', error);
            throw error;
        }
    }

    /**
     * Check if phone is verified
     */
    async isPhoneVerified(phone) {
        try {
            const otpKey = `otp:${phone}`;
            const otpData = await redisClient.get(otpKey);

            return otpData?.verified === true;
        } catch (error) {
            console.error('Phone verification check error:', error);
            return false;
        }
    }

    /**
     * Resend OTP
     */
    async resendOTP(phone) {
        try {
            // Clear existing OTP
            const otpKey = `otp:${phone}`;
            await redisClient.del(otpKey);

            // Clear cooldown if exists
            const cooldownKey = `otp:cooldown:${phone}`;
            await redisClient.del(cooldownKey);

            // Generate new OTP
            return await this.generateAndStoreOTP(phone);
        } catch (error) {
            console.error('Resend OTP error:', error);
            throw error;
        }
    }

    /**
     * Clean up expired OTPs (for cron job)
     */
    async cleanupExpiredOTPs() {
        try {
            // This would require Redis SCAN command implementation
            // For now, we'll handle expiration via Redis TTL
            console.log('OTP cleanup completed (handled by Redis TTL)');
            return { success: true, message: 'OTP cleanup completed' };
        } catch (error) {
            console.error('OTP cleanup error:', error);
            throw error;
        }
    }

    /**
     * Get OTP status
     */
    async getOTPStatus(phone) {
        try {
            const otpKey = `otp:${phone}`;
            const otpData = await redisClient.get(otpKey);

            if (!otpData) {
                return {
                    exists: false,
                    message: 'No active OTP found',
                };
            }

            const now = Date.now();
            const generatedAt = otpData.generatedAt;
            const expiryTime = generatedAt + (this.otpExpirySeconds * 1000);
            const timeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));

            return {
                exists: true,
                verified: otpData.verified || false,
                attempts: otpData.attempts || 0,
                attemptsLeft: this.maxOtpAttempts - (otpData.attempts || 0),
                timeLeftSeconds: timeLeft,
                generatedAt: new Date(generatedAt).toISOString(),
                expiresAt: new Date(expiryTime).toISOString(),
            };
        } catch (error) {
            console.error('OTP status check error:', error);
            throw error;
        }
    }

    /**
     * Force verify phone (admin function)
     */
    async forceVerifyPhone(phone) {
        try {
            const otpKey = `otp:${phone}`;

            await redisClient.set(otpKey, {
                verified: true,
                verifiedAt: Date.now(),
                forcedVerification: true,
            }, this.otpExpirySeconds);

            return {
                success: true,
                message: 'Phone forcefully verified',
                verifiedAt: Date.now(),
            };
        } catch (error) {
            console.error('Force verify error:', error);
            throw error;
        }
    }
}

// Singleton instance
const otpService = new OTPService();
module.exports = otpService;