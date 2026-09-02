const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User Schema
 */
const userSchema = new mongoose.Schema({
    // Personal Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Contact Information
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                // Basic phone validation (10-15 digits)
                return /^\+?[1-9]\d{9,14}$/.test(v);
            },
            message: 'Please enter a valid phone number',
        },
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                // Email is optional, but if provided must be valid
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address',
        },
    },

    // Authentication
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false, // Don't include password by default in queries
    },

    // Role Management
    role: {
        type: String,
        enum: ['patient', 'doctor', 'health_worker', 'admin'],
        default: 'patient',
    },

    // Verification Status
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true,
    },

    // Profile Information
    avatar: {
        type: String,
        default: null,
    },

    dateOfBirth: {
        type: Date,
        validate: {
            validator: function (v) {
                // Date of birth cannot be in the future
                return !v || v <= new Date();
            },
            message: 'Date of birth cannot be in the future',
        },
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'other', null],
        default: null,
    },

    // Address
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India',
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0],
            },
        },
    },

    // Account Metadata
    lastLoginAt: {
        type: Date,
        default: null,
    },

    loginAttempts: {
        type: Number,
        default: 0,
        select: false,
    },

    lockUntil: {
        type: Date,
        default: null,
        select: false,
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
 * Virtual for full name
 */
userSchema.virtual('fullName').get(function () {
    return this.name;
});

/**
 * Indexes
 */
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ email: 1 }, { sparse: true }); // Sparse index since email is optional
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ 'address.coordinates': '2dsphere' });

/**
 * Pre-save middleware
 */
userSchema.pre('save', async function (next) {
    // Update updatedAt timestamp
    this.updatedAt = Date.now();

    // Hash password if modified
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }

    next();
});

/**
 * Password comparison method
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

/**
 * Check if account is locked
 */
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

/**
 * Increment login attempts
 */
userSchema.methods.incrementLoginAttempts = function () {
    // If previous lock has expired, reset attempts
    if (this.lockUntil && this.lockUntil < Date.now()) {
        this.loginAttempts = 1;
        this.lockUntil = null;
        return this.save();
    }

    // Increment attempts
    this.loginAttempts += 1;

    // Lock account if attempts exceed threshold
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

    if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
        this.lockUntil = Date.now() + LOCK_TIME;
    }

    return this.save();
};

/**
 * Reset login attempts on successful login
 */
userSchema.methods.resetLoginAttempts = function () {
    this.loginAttempts = 0;
    this.lockUntil = null;
    this.lastLoginAt = Date.now();
    return this.save();
};

/**
 * Check if user has specific role
 */
userSchema.methods.hasRole = function (role) {
    return this.role === role;
};

/**
 * Check if user has any of the specified roles
 */
userSchema.methods.hasAnyRole = function (roles) {
    return roles.includes(this.role);
};

/**
 * Get user's permissions based on role
 */
userSchema.methods.getPermissions = function () {
    const rolePermissions = {
        patient: [
            'view_own_profile',
            'update_own_profile',
            'book_appointment',
            'view_own_records',
            'view_own_prescriptions',
        ],
        doctor: [
            'view_patient_records',
            'create_medical_records',
            'create_prescriptions',
            'manage_appointments',
            'call_next_patient',
            'create_referrals',
        ],
        health_worker: [
            'manage_queue',
            'view_patient_info',
            'assist_referrals',
            'manage_facility_workflow',
        ],
        admin: [
            'manage_users',
            'manage_facilities',
            'manage_doctors',
            'system_monitoring',
            'view_audit_logs',
        ],
    };

    return rolePermissions[this.role] || [];
};

/**
 * Check if user has specific permission
 */
userSchema.methods.hasPermission = function (permission) {
    return this.getPermissions().includes(permission);
};

/**
 * Static method to find user by phone
 */
userSchema.statics.findByPhone = function (phone) {
    return this.findOne({ phone }).select('+password');
};

/**
 * Static method to find active users
 */
userSchema.statics.findActiveUsers = function () {
    return this.find({ isActive: true });
};

/**
 * Static method to get user statistics
 */
userSchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 },
                active: {
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
                },
                verified: {
                    $sum: { $cond: [{ $eq: ['$isPhoneVerified', true] }, 1, 0] },
                },
            },
        },
        {
            $project: {
                role: '$_id',
                total: '$count',
                active: 1,
                verified: 1,
                _id: 0,
            },
        },
        {
            $sort: { role: 1 },
        },
    ]);

    const total = await this.countDocuments();
    const active = await this.countDocuments({ isActive: true });
    const verified = await this.countDocuments({ isPhoneVerified: true });

    return {
        total,
        active,
        verified,
        byRole: stats,
    };
};

/**
 * Export User model
 */
module.exports = mongoose.model('User', userSchema);