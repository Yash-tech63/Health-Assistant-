const jwt = require('jsonwebtoken');

/**
 * Generate JWT tokens
 */
class TokenGenerator {
    /**
     * Generate access token
     */
    static generateAccessToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m' }
        );
    }

    /**
     * Generate refresh token
     */
    static generateRefreshToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
        );
    }

    /**
     * Generate both tokens
     */
    static generateTokens(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    /**
     * Verify access token
     */
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (error) {
            return null;
        }
    }

    /**
     * Verify refresh token
     */
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return null;
        }
    }

    /**
     * Decode token without verification
     */
    static decodeToken(token) {
        return jwt.decode(token);
    }

    /**
     * Generate tokens for user
     */
    static generateUserTokens(user) {
        const payload = {
            id: user._id,
            phone: user.phone,
            role: user.role,
        };

        return this.generateTokens(payload);
    }

    /**
     * Extract token from header
     */
    static extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.split(' ')[1];
    }
}

module.exports = TokenGenerator;