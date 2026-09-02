const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger definition
 */
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Smart Healthcare Management Platform API',
        version: '1.0.0',
        description: `
# Smart Healthcare Management Platform Backend API

A comprehensive healthcare management system with features for patients, doctors, and healthcare facilities.

## Features
- **Authentication**: Phone-based registration with OTP verification
- **Patient Management**: Complete patient profiles and medical history
- **Facility Discovery**: Search nearby healthcare facilities
- **Appointment Booking**: Book appointments with doctors
- **Queue Management**: Real-time digital queue system
- **Medical Records**: Digital patient records and prescriptions
- **Symptom Triage**: AI-assisted symptom assessment
- **Teleconsultation**: Virtual consultation system

## Authentication
All private endpoints require JWT authentication. Include the token in the Authorization header:
\`Authorization: Bearer <access_token>\`

## Base URL
All API endpoints are prefixed with \`/api\`

## Response Format
All responses follow a standard format:
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
\`\`\`
    `,
        contact: {
            name: 'API Support',
            email: 'support@smarthealthcare.com',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: 'http://localhost:5000/api',
            description: 'Development server',
        },
        {
            url: 'https://api.smarthealthcare.com/api',
            description: 'Production server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter JWT token in format: Bearer <token>',
            },
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false,
                    },
                    message: {
                        type: 'string',
                        example: 'Error message',
                    },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                field: {
                                    type: 'string',
                                    example: 'email',
                                },
                                message: {
                                    type: 'string',
                                    example: 'Email is required',
                                },
                            },
                        },
                    },
                },
            },
            SuccessResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        example: 'Operation successful',
                    },
                    data: {
                        type: 'object',
                        additionalProperties: true,
                    },
                },
            },
            User: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439011',
                    },
                    name: {
                        type: 'string',
                        example: 'John Doe',
                    },
                    phone: {
                        type: 'string',
                        example: '+919876543210',
                    },
                    email: {
                        type: 'string',
                        example: 'john@example.com',
                    },
                    role: {
                        type: 'string',
                        enum: ['patient', 'doctor', 'health_worker', 'admin'],
                        example: 'patient',
                    },
                    isPhoneVerified: {
                        type: 'boolean',
                        example: true,
                    },
                    isActive: {
                        type: 'boolean',
                        example: true,
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
            },
            Patient: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439012',
                    },
                    user: {
                        $ref: '#/components/schemas/User',
                    },
                    fullName: {
                        type: 'string',
                        example: 'John Doe',
                    },
                    dateOfBirth: {
                        type: 'string',
                        format: 'date',
                        example: '1990-01-01',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female', 'other'],
                        example: 'male',
                    },
                    bloodGroup: {
                        type: 'string',
                        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', null],
                        example: 'O+',
                    },
                    phone: {
                        type: 'string',
                        example: '+919876543210',
                    },
                    emergencyContact: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                example: 'Jane Doe',
                            },
                            relationship: {
                                type: 'string',
                                example: 'spouse',
                            },
                            phone: {
                                type: 'string',
                                example: '+919876543211',
                            },
                        },
                    },
                    allergies: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                allergen: {
                                    type: 'string',
                                    example: 'Peanuts',
                                },
                                severity: {
                                    type: 'string',
                                    enum: ['mild', 'moderate', 'severe'],
                                    example: 'severe',
                                },
                            },
                        },
                    },
                    isHighRisk: {
                        type: 'boolean',
                        example: false,
                    },
                },
            },
            Facility: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439013',
                    },
                    name: {
                        type: 'string',
                        example: 'City General Hospital',
                    },
                    facilityType: {
                        type: 'string',
                        enum: ['PHC', 'CHC', 'District Hospital', 'Private Hospital', 'Clinic', 'Diagnostic Center', 'Nursing Home'],
                        example: 'District Hospital',
                    },
                    address: {
                        type: 'object',
                        properties: {
                            street: {
                                type: 'string',
                                example: '123 Main Street',
                            },
                            city: {
                                type: 'string',
                                example: 'Mumbai',
                            },
                            state: {
                                type: 'string',
                                example: 'Maharashtra',
                            },
                            pincode: {
                                type: 'string',
                                example: '400001',
                            },
                        },
                    },
                    location: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                enum: ['Point'],
                                example: 'Point',
                            },
                            coordinates: {
                                type: 'array',
                                items: {
                                    type: 'number',
                                },
                                example: [72.8777, 19.0760],
                            },
                        },
                    },
                    phone: {
                        type: 'string',
                        example: '+912244112233',
                    },
                    services: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'General Consultation',
                                },
                                available: {
                                    type: 'boolean',
                                    example: true,
                                },
                            },
                        },
                    },
                    emergencyServices: {
                        type: 'boolean',
                        example: true,
                    },
                    averageRating: {
                        type: 'number',
                        example: 4.5,
                    },
                },
            },
            Doctor: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '507f1f77bcf86cd799439014',
                    },
                    doctorName: {
                        type: 'string',
                        example: 'Dr. Smith',
                    },
                    specialization: {
                        type: 'string',
                        example: 'Cardiology',
                    },
                    experience: {
                        type: 'number',
                        example: 15,
                    },
                    facility: {
                        $ref: '#/components/schemas/Facility',
                    },
                    consultationFee: {
                        type: 'number',
                        example: 500,
                    },
                    isAvailable: {
                        type: 'boolean',
                        example: true,
                    },
                },
            },
        },
        parameters: {
            pageParam: {
                name: 'page',
                in: 'query',
                description: 'Page number',
                required: false,
                schema: {
                    type: 'integer',
                    default: 1,
                    minimum: 1,
                },
            },
            limitParam: {
                name: 'limit',
                in: 'query',
                description: 'Number of items per page',
                required: false,
                schema: {
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 100,
                },
            },
        },
        responses: {
            UnauthorizedError: {
                description: 'Access token is missing or invalid',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse',
                        },
                        example: {
                            success: false,
                            message: 'Unauthorized',
                        },
                    },
                },
            },
            ForbiddenError: {
                description: 'User does not have permission',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse',
                        },
                        example: {
                            success: false,
                            message: 'Forbidden',
                        },
                    },
                },
            },
            NotFoundError: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse',
                        },
                        example: {
                            success: false,
                            message: 'Resource not found',
                        },
                    },
                },
            },
            ValidationError: {
                description: 'Validation failed',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse',
                        },
                        example: {
                            success: false,
                            message: 'Validation failed',
                            errors: [
                                {
                                    field: 'email',
                                    message: 'Email is required',
                                },
                            ],
                        },
                    },
                },
            },
        },
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User registration, login, and authentication',
        },
        {
            name: 'Patients',
            description: 'Patient profile management',
        },
        {
            name: 'Facilities',
            description: 'Healthcare facility management',
        },
        {
            name: 'Doctors',
            description: 'Doctor profiles and availability',
        },
        {
            name: 'Appointments',
            description: 'Appointment booking and management',
        },
        {
            name: 'Queue',
            description: 'Digital queue management',
        },
        {
            name: 'Medical Records',
            description: 'Patient medical records',
        },
        {
            name: 'Symptom Assessment',
            description: 'AI-assisted symptom triage',
        },
        {
            name: 'Referrals',
            description: 'Patient referral tracking',
        },
        {
            name: 'Notifications',
            description: 'System notifications',
        },
        {
            name: 'Teleconsultation',
            description: 'Virtual consultations',
        },
    ],
    security: [
        {
            bearerAuth: [],
        },
    ],
};

/**
 * Options for swagger-jsdoc
 */
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to the API routes
};

/**
 * Initialize swagger-jsdoc
 */
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;