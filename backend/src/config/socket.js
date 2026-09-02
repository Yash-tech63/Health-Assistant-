const socketIO = require('socket.io');
const { socketCorsOptions } = require('./cors');

class SocketManager {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // userId -> socketId
        this.roomUsers = new Map(); // roomId -> [socketId]
        this.doctorQueues = new Map(); // doctorId -> {queue: [], currentToken: null}
    }

    /**
     * Initialize Socket.IO with server
     */
    init(server) {
        this.io = socketIO(server, {
            cors: socketCorsOptions,
            pingInterval: process.env.SOCKET_PING_INTERVAL || 25000,
            pingTimeout: process.env.SOCKET_PING_TIMEOUT || 60000,
        });

        this.setupConnectionHandlers();
        return this.io;
    }

    getIO() {
        return this.io;
    }

    /**
     * Setup Socket.IO connection handlers
     */
    setupConnectionHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`✅ Socket connected: ${socket.id}`);

            // User authentication and connection
            socket.on('authenticate', (userId) => {
                this.handleAuthentication(socket, userId);
            });

            // Queue management
            socket.on('joinQueue', (doctorId) => {
                this.handleJoinQueue(socket, doctorId);
            });

            socket.on('leaveQueue', (doctorId) => {
                this.handleLeaveQueue(socket, doctorId);
            });

            socket.on('getQueueStatus', (doctorId) => {
                this.handleGetQueueStatus(socket, doctorId);
            });

            // Teleconsultation room management
            socket.on('joinRoom', (roomId) => {
                this.handleJoinRoom(socket, roomId);
            });

            socket.on('leaveRoom', (roomId) => {
                this.handleLeaveRoom(socket, roomId);
            });

            socket.on('webrtcSignal', (data) => {
                this.handleWebRTCSignal(socket, data);
            });
            ['offer', 'answer', 'iceCandidate'].forEach((event) => {
                socket.on(event, (data) => this.handleWebRTCSignal(socket, { ...data, signal: { type: event, payload: data.signal || data } }));
            });

            // Doctor specific events
            socket.on('doctorReady', (doctorId) => {
                this.handleDoctorReady(socket, doctorId);
            });

            socket.on('callNextPatient', (doctorId) => {
                this.handleCallNextPatient(socket, doctorId);
            });

            socket.on('consultationComplete', (data) => {
                this.handleConsultationComplete(socket, data);
            });

            // Disconnection handler
            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });
        });
    }

    /**
     * Handle user authentication
     */
    handleAuthentication(socket, userId) {
        this.connectedUsers.set(userId, socket.id);
        socket.join(`user:${userId}`);
        console.log(`🔗 User ${userId} connected on socket ${socket.id}`);
    }

    /**
     * Handle joining queue
     */
    handleJoinQueue(socket, doctorId) {
        if (!this.doctorQueues.has(doctorId)) {
            this.doctorQueues.set(doctorId, {
                queue: [],
                currentToken: null,
                estimatedWaitingTime: 0,
            });
        }

        const queue = this.doctorQueues.get(doctorId);
        const userId = this.getUserIdBySocketId(socket.id);

        if (userId && !queue.queue.includes(userId)) {
            queue.queue.push(userId);
            this.calculateWaitingTime(doctorId);

            // Notify doctor
            socket.to(`doctor:${doctorId}`).emit('patientJoinedQueue', {
                patientId: userId,
                position: queue.queue.length,
                estimatedWaitingTime: queue.estimatedWaitingTime,
            });

            // Notify patient
            socket.emit('queueJoined', {
                position: queue.queue.length,
                estimatedWaitingTime: queue.estimatedWaitingTime,
            });

            // Broadcast queue update
            this.broadcastQueueUpdate(doctorId);
        }
    }

    /**
     * Handle leaving queue
     */
    handleLeaveQueue(socket, doctorId) {
        const queue = this.doctorQueues.get(doctorId);
        if (queue) {
            const userId = this.getUserIdBySocketId(socket.id);
            const index = queue.queue.indexOf(userId);

            if (index > -1) {
                queue.queue.splice(index, 1);
                this.calculateWaitingTime(doctorId);

                // Notify doctor
                socket.to(`doctor:${doctorId}`).emit('patientLeftQueue', {
                    patientId: userId,
                });

                // Broadcast queue update
                this.broadcastQueueUpdate(doctorId);
            }
        }
    }

    /**
     * Handle getting queue status
     */
    handleGetQueueStatus(socket, doctorId) {
        const queue = this.doctorQueues.get(doctorId);
        if (queue) {
            const userId = this.getUserIdBySocketId(socket.id);
            const position = queue.queue.indexOf(userId) + 1;

            socket.emit('queueStatus', {
                position: position > 0 ? position : null,
                currentToken: queue.currentToken,
                patientsAhead: position > 0 ? position - 1 : 0,
                estimatedWaitingTime: queue.estimatedWaitingTime,
                queueLength: queue.queue.length,
            });
        }
    }

    /**
     * Handle joining teleconsultation room
     */
    handleJoinRoom(socket, roomId) {
        socket.join(`room:${roomId}`);

        if (!this.roomUsers.has(roomId)) {
            this.roomUsers.set(roomId, []);
        }

        const users = this.roomUsers.get(roomId);
        users.push(socket.id);

        // Notify other users in room
        socket.to(`room:${roomId}`).emit('userJoined', {
            socketId: socket.id,
            userCount: users.length,
        });

        console.log(`🚪 Socket ${socket.id} joined room ${roomId}`);
    }

    /**
     * Handle leaving teleconsultation room
     */
    handleLeaveRoom(socket, roomId) {
        socket.leave(`room:${roomId}`);

        const users = this.roomUsers.get(roomId);
        if (users) {
            const index = users.indexOf(socket.id);
            if (index > -1) {
                users.splice(index, 1);
            }

            if (users.length === 0) {
                this.roomUsers.delete(roomId);
            }
        }

        // Notify other users
        socket.to(`room:${roomId}`).emit('userLeft', {
            socketId: socket.id,
            userCount: users ? users.length : 0,
        });

        console.log(`🚪 Socket ${socket.id} left room ${roomId}`);
    }

    /**
     * Handle WebRTC signaling
     */
    handleWebRTCSignal(socket, data) {
        const { roomId, signal, targetSocketId } = data;

        // Forward signal to target socket
        if (!targetSocketId || !roomId || !socket.rooms.has(`room:${roomId}`)) return;
        socket.to(targetSocketId).emit('webrtcSignal', {
            signal,
            fromSocketId: socket.id,
        });
        if (signal && signal.type) socket.to(targetSocketId).emit(signal.type, { signal: signal.payload, fromSocketId: socket.id, roomId });
    }

    /**
     * Handle doctor ready event
     */
    handleDoctorReady(socket, doctorId) {
        socket.join(`doctor:${doctorId}`);
        console.log(`👨‍⚕️ Doctor ${doctorId} ready for consultations`);
    }

    /**
     * Handle calling next patient
     */
    handleCallNextPatient(socket, doctorId) {
        const queue = this.doctorQueues.get(doctorId);
        if (queue && queue.queue.length > 0) {
            const nextPatientId = queue.queue.shift();
            queue.currentToken = nextPatientId;
            this.calculateWaitingTime(doctorId);

            // Notify patient
            this.io.to(`user:${nextPatientId}`).emit('doctorCalling', {
                doctorId: doctorId,
                tokenNumber: queue.currentToken,
            });

            // Notify doctor
            socket.emit('nextPatientCalled', {
                patientId: nextPatientId,
            });

            // Broadcast queue update
            this.broadcastQueueUpdate(doctorId);
        }
    }

    /**
     * Handle consultation complete
     */
    handleConsultationComplete(socket, data) {
        const { doctorId, patientId } = data;
        const queue = this.doctorQueues.get(doctorId);

        if (queue) {
            queue.currentToken = null;

            // Notify patient
            this.io.to(`user:${patientId}`).emit('consultationComplete', {
                doctorId: doctorId,
            });

            // Broadcast queue update
            this.broadcastQueueUpdate(doctorId);
        }
    }

    /**
     * Handle disconnection
     */
    handleDisconnect(socket) {
        const userId = this.getUserIdBySocketId(socket.id);

        if (userId) {
            this.connectedUsers.delete(userId);

            // Remove from all queues
            for (const [doctorId, queue] of this.doctorQueues.entries()) {
                const index = queue.queue.indexOf(userId);
                if (index > -1) {
                    queue.queue.splice(index, 1);
                    this.calculateWaitingTime(doctorId);
                    this.broadcastQueueUpdate(doctorId);
                }
            }

            // Remove from all rooms
            for (const [roomId, users] of this.roomUsers.entries()) {
                const index = users.indexOf(socket.id);
                if (index > -1) {
                    users.splice(index, 1);
                    if (users.length === 0) {
                        this.roomUsers.delete(roomId);
                    }
                }
            }
        }

        console.log(`🔻 Socket disconnected: ${socket.id}`);
    }

    /**
     * Get user ID by socket ID
     */
    getUserIdBySocketId(socketId) {
        for (const [userId, sockId] of this.connectedUsers.entries()) {
            if (sockId === socketId) {
                return userId;
            }
        }
        return null;
    }

    /**
     * Calculate waiting time for queue
     */
    calculateWaitingTime(doctorId) {
        const queue = this.doctorQueues.get(doctorId);
        if (queue) {
            const consultationTime = parseInt(process.env.DEFAULT_CONSULTATION_TIME_MINUTES) || 15;
            queue.estimatedWaitingTime = queue.queue.length * consultationTime;
        }
    }

    /**
     * Broadcast queue update to all interested parties
     */
    broadcastQueueUpdate(doctorId) {
        const queue = this.doctorQueues.get(doctorId);
        if (queue) {
            this.io.emit('queueUpdated', {
                doctorId: doctorId,
                queueLength: queue.queue.length,
                currentToken: queue.currentToken,
                estimatedWaitingTime: queue.estimatedWaitingTime,
                patientsInQueue: queue.queue,
            });
        }
    }

    /**
     * Emit event to specific user
     */
    emitToUser(userId, event, data) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, data);
        }
    }

    /**
     * Emit event to room
     */
    emitToRoom(roomId, event, data) {
        this.io.to(`room:${roomId}`).emit(event, data);
    }

    /**
     * Get socket instance
     */
    getIO() {
        return this.io;
    }
}

// Singleton instance
const socketManager = new SocketManager();
module.exports = socketManager;
