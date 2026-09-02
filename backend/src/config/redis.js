const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    /**
     * Connect to Redis server
     */
    async connect() {
        try {
            this.client = redis.createClient({
                url: process.env.REDIS_URL,
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: process.env.REDIS_PORT || 6379,
                    reconnectStrategy: (retries) => {
                        if (retries > 10) {
                            console.error('❌ Redis reconnection attempts exhausted');
                            return new Error('Redis reconnection failed');
                        }
                        return Math.min(retries * 100, 3000);
                    },
                },
            });

            this.client.on('error', (err) => {
                console.error('❌ Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('✅ Redis Connected');
                this.isConnected = true;
            });

            this.client.on('end', () => {
                console.log('🔻 Redis connection closed');
                this.isConnected = false;
            });

            await this.client.connect();
            return this.client;

        } catch (error) {
            console.error('❌ Redis connection failed:', error.message);
            throw error;
        }
    }

    /**
     * Get Redis client instance
     */
    getClient() {
        if (!this.client || !this.isConnected) {
            throw new Error('Redis client not connected');
        }
        return this.client;
    }

    /**
     * Set key-value pair with expiry
     */
    async set(key, value, expirySeconds = null) {
        try {
            const client = this.getClient();
            if (expirySeconds) {
                await client.setEx(key, expirySeconds, JSON.stringify(value));
            } else {
                await client.set(key, JSON.stringify(value));
            }
            return true;
        } catch (error) {
            console.error('Redis set error:', error);
            return false;
        }
    }

    /**
     * Get value by key
     */
    async get(key) {
        try {
            const client = this.getClient();
            const value = await client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    /**
     * Delete key
     */
    async del(key) {
        try {
            const client = this.getClient();
            await client.del(key);
            return true;
        } catch (error) {
            console.error('Redis delete error:', error);
            return false;
        }
    }

    /**
     * Check if key exists
     */
    async exists(key) {
        try {
            const client = this.getClient();
            const result = await client.exists(key);
            return result === 1;
        } catch (error) {
            console.error('Redis exists error:', error);
            return false;
        }
    }

    /**
     * Close Redis connection
     */
    async disconnect() {
        try {
            if (this.client && this.isConnected) {
                await this.client.quit();
                this.isConnected = false;
                console.log('🔻 Redis connection closed');
            }
        } catch (error) {
            console.error('Redis disconnect error:', error);
        }
    }
}

// Singleton instance
const redisClient = new RedisClient();
module.exports = redisClient;