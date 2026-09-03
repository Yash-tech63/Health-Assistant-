const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.inMemoryStore = new Map();
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
                        if (retries > 3) {
                            return new Error('Redis reconnection limit reached');
                        }
                        return Math.min(retries * 100, 1000);
                    },
                },
            });

            this.client.on('error', (err) => {
                // Log warning only
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('✅ Redis Connected');
                this.isConnected = true;
            });

            this.client.on('end', () => {
                this.isConnected = false;
            });

            await this.client.connect();
            return this.client;

        } catch (error) {
            console.warn('⚠️ Redis not available, using in-memory store fallback');
            this.isConnected = false;
            return null;
        }
    }

    /**
     * Set key-value pair with expiry
     */
    async set(key, value, expirySeconds = null) {
        try {
            if (this.isConnected && this.client) {
                if (expirySeconds) {
                    await this.client.setEx(key, expirySeconds, JSON.stringify(value));
                } else {
                    await this.client.set(key, JSON.stringify(value));
                }
            } else {
                this.inMemoryStore.set(key, {
                    value,
                    expiresAt: expirySeconds ? Date.now() + (expirySeconds * 1000) : null
                });
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
            if (this.isConnected && this.client) {
                const value = await this.client.get(key);
                return value ? JSON.parse(value) : null;
            } else {
                const entry = this.inMemoryStore.get(key);
                if (!entry) return null;
                if (entry.expiresAt && Date.now() > entry.expiresAt) {
                    this.inMemoryStore.delete(key);
                    return null;
                }
                return entry.value;
            }
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
            if (this.isConnected && this.client) {
                await this.client.del(key);
            } else {
                this.inMemoryStore.delete(key);
            }
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
            if (this.isConnected && this.client) {
                const result = await this.client.exists(key);
                return result === 1;
            } else {
                const entry = this.inMemoryStore.get(key);
                if (!entry) return false;
                if (entry.expiresAt && Date.now() > entry.expiresAt) {
                    this.inMemoryStore.delete(key);
                    return false;
                }
                return true;
            }
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