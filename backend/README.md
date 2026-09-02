# Smart Healthcare Management Platform Backend

A production-ready backend for a healthcare management platform built with Node.js, Express.js, MongoDB, and Redis.

## Features

- **Authentication & Authorization**: JWT-based authentication with phone verification via OTP
- **Patient Management**: Complete patient profiles with medical history
- **Healthcare Facility Discovery**: Search nearby facilities with geospatial queries
- **Doctor Management**: Doctor profiles, availability, and specialization
- **Appointment Booking**: Book appointments with doctors
- **Digital Queue Management**: Real-time queue updates with Socket.IO
- **Medical Records**: Digital patient records with prescriptions and lab reports
- **Symptom Triage**: AI-assisted symptom assessment with risk categorization
- **Referral Tracking**: Track patient referrals between facilities
- **Teleconsultation**: Virtual consultation system
- **Notifications**: Real-time notifications for appointments and updates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache & Queue**: Redis
- **Real-time**: Socket.IO
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, rate limiting

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── db.js       # MongoDB connection
│   ├── redis.js    # Redis client
│   └── socket.js   # Socket.IO setup
├── controllers/     # Request handlers
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # Custom middleware
├── services/        # Business logic
├── validators/      # Request validation
├── utils/          # Utility functions
├── docs/           # API documentation
├── jobs/           # Scheduled jobs (cron)
├── scripts/        # Database scripts
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher
- Redis 7.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` file with your configuration.

4. Start MongoDB and Redis services
```bash
# MongoDB (on Ubuntu)
sudo systemctl start mongod

# Redis (on Ubuntu)
sudo systemctl start redis-server
```

5. Run the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smart_healthcare

# JWT Secrets
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Redis
REDIS_URL=redis://localhost:6379

# OTP Configuration
OTP_EXPIRY_SECONDS=300
OTP_RESEND_COOLDOWN_SECONDS=60

# Security
BCRYPT_SALT_ROUNDS=12

# CORS
CLIENT_URL=http://localhost:3000
```

## API Documentation

Once the server is running, access the Swagger API documentation at:
```
http://localhost:5000/api-docs
```

## Key Features Implementation

### 1. Authentication System
- Phone-based registration with OTP verification
- JWT access and refresh tokens
- Password hashing with bcrypt
- Rate limiting for security
- Token blacklisting with Redis

### 2. Patient Management
- Complete patient profiles
- Medical history tracking
- Allergy and chronic disease management
- Emergency contact information
- Consent management

### 3. Healthcare Facility Discovery
- Geospatial search for nearby facilities
- Facility types (PHC, CHC, District Hospital, Private Hospital)
- Service and diagnostic facility listings
- Real-time availability checking

### 4. Appointment System
- Book appointments with doctors
- Digital token generation
- Queue position tracking
- Estimated waiting time calculation

### 5. Digital Queue Management
- Real-time queue updates via Socket.IO
- Token calling system
- Priority-based queue (emergency, urgent, normal)
- Queue statistics and analytics

### 6. Medical Records
- Digital patient records
- Prescription management
- Lab report tracking
- Diagnosis coding (ICD-10)

### 7. Symptom Triage
- AI-assisted symptom assessment
- Risk level categorization (low, medium, high, emergency)
- Recommendation engine
- Follow-up system for high-risk patients

### 8. Referral Tracking
- Inter-facility referrals
- Referral status tracking
- Priority-based referrals
- Communication logs

### 9. Teleconsultation
- Virtual consultation rooms
- Real-time video consultation
- Session recording (optional)
- Technical quality monitoring

### 10. Notifications
- Real-time notifications via Socket.IO
- SMS/email notifications
- Appointment reminders
- Medication reminders
- High-risk patient alerts

## Database Design

### Key Models

1. **User**: Authentication and basic user information
2. **Patient**: Detailed patient medical profiles
3. **Doctor**: Doctor profiles and availability
4. **Facility**: Healthcare facilities with geospatial data
5. **Appointment**: Patient-doctor appointments
6. **Queue**: Real-time queue management
7. **MedicalRecord**: Patient medical records
8. **Prescription**: Medication prescriptions
9. **LabReport**: Laboratory test reports
10. **SymptomAssessment**: Symptom triage assessments
11. **Referral**: Patient referrals
12. **Notification**: System notifications
13. **Teleconsultation**: Virtual consultations

## Security Features

- **Input Validation**: Zod validation for all API endpoints
- **Rate Limiting**: Protection against brute force attacks
- **SQL Injection Prevention**: Mongoose provides protection
- **XSS Protection**: Helmet middleware
- **CORS**: Configured for specific origins
- **Password Security**: bcrypt hashing with salt rounds
- **Token Security**: JWT with short expiry times
- **Session Management**: Redis-based token storage

## Scalability Considerations

- **Horizontal Scaling**: Stateless architecture
- **Caching**: Redis for frequently accessed data
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: MongoDB connection pooling
- **Load Balancing**: Ready for deployment behind load balancer
- **Microservices Ready**: Modular architecture for future decomposition

## Deployment

### Docker Deployment

1. Build Docker image
```bash
docker build -t smart-healthcare-backend .
```

2. Run with Docker Compose
```bash
docker-compose up -d
```

### PM2 Deployment (Production)

```bash
npm install -g pm2
pm2 start src/server.js --name smart-healthcare
pm2 save
pm2 startup
```

### Environment Variables in Production

Use environment-specific `.env` files or use your hosting provider's environment variable management.

## Testing

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Test coverage
npm run test:coverage
```

### Test Environment

Create a `.env.test` file with test-specific configuration.

## Monitoring & Logging

- **Morgan**: HTTP request logging
- **Winston**: Application logging (configurable)
- **Health Checks**: `/api/health` endpoint
- **Metrics**: Ready for Prometheus integration
- **Error Tracking**: Sentry integration ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@smarthealthcare.com or create an issue in the GitHub repository.

## Acknowledgments

- Healthcare professionals who provided domain expertise
- Open source community for amazing libraries
- Medical standards organizations for coding standards

---

**Disclaimer**: This is a technical demonstration. For production healthcare systems, ensure compliance with local healthcare regulations, data protection laws, and medical standards.