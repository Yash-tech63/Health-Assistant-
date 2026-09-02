# Smart Healthcare Backend - Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18.x or higher
- MongoDB 6.x or higher
- Redis 7.x or higher
- npm or yarn package manager

### 2. Installation Steps

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env file with your configuration

# 4. Start MongoDB and Redis
# On Ubuntu:
sudo systemctl start mongod
sudo systemctl start redis-server

# 5. Run the server
npm run dev
```

### 3. Database Seeding

```bash
# Seed database with sample data
npm run seed

# Sample credentials will be displayed
# Admin: +919999999999 / Admin@123
# Doctor: +919876543210 / Doctor@123
# Patient: +919876543213 / Patient@123
```

### 4. Testing the Setup

```bash
# Run setup test
node test-setup.js

# Expected output:
# ✅ Health Check: Server is healthy
# ✅ API Documentation available
# ✅ Authentication endpoints working
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

### Authentication Flow
1. **Register**: `POST /auth/register`
2. **Send OTP**: `POST /auth/send-otp`
3. **Verify OTP**: `POST /auth/verify-otp`
4. **Login**: `POST /auth/login`
5. **Get Profile**: `GET /auth/me`

### Patient Management
- `GET /patients/me` - Get patient profile
- `PUT /patients/me` - Update profile
- `PUT /patients/me/health-info` - Update health information

### Facility Management
- `GET /facilities` - List all facilities
- `GET /facilities/nearby` - Find nearby facilities
- `GET /facilities/:id` - Get facility details

### Doctor Management
- `GET /doctors` - List all doctors
- `GET /doctors/:id` - Get doctor details
- `GET /doctors/:id/availability` - Check availability

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smart_healthcare

# JWT Secrets
JWT_ACCESS_SECRET=your_access_token_secret_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_here_change_in_production
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

## Docker Deployment

### Using Docker Compose

```bash
# 1. Build and start all services
docker-compose up -d

# 2. Check service status
docker-compose ps

# 3. View logs
docker-compose logs -f app

# 4. Stop services
docker-compose down
```

### Services Included
- **App**: Node.js backend (port 5000)
- **MongoDB**: Database (port 27017)
- **Redis**: Cache (port 6379)
- **Mongo Express**: Web UI for MongoDB (port 8081)
- **Redis Commander**: Web UI for Redis (port 8082)

## Testing with Postman

1. Import `postman-collection.json` into Postman
2. Set environment variables in Postman:
   - `baseUrl`: `http://localhost:5000/api`
3. Start with "Health Check" request
4. Test authentication flow
5. Use sample credentials from seed script

## Development Commands

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# Database seeding
npm run seed

# Lint code (if configured)
npm run lint

# Run tests (if configured)
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/         # Database schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/         # Utility functions
│   ├── docs/          # API documentation
│   ├── scripts/       # Database scripts
│   ├── app.js         # Express app setup
│   └── server.js      # Server entry point
├── uploads/           # File uploads directory
├── .env.example      # Environment template
├── .env             # Environment variables
├── package.json     # Dependencies
├── Dockerfile       # Docker configuration
├── docker-compose.yml # Multi-container setup
├── README.md        # Documentation
└── SETUP_GUIDE.md   # This file
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   
   # Start MongoDB if not running
   sudo systemctl start mongod
   ```

2. **Redis Connection Error**
   ```bash
   # Check if Redis is running
   sudo systemctl status redis-server
   
   # Start Redis if not running
   sudo systemctl start redis-server
   ```

3. **Port Already in Use**
   ```bash
   # Find process using port 5000
   sudo lsof -i :5000
   
   # Kill the process
   sudo kill -9 <PID>
   ```

4. **Missing Dependencies**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs and Monitoring

- **Application Logs**: Check console output or `logs/` directory
- **Database Logs**: MongoDB logs at `/var/log/mongodb/mongod.log`
- **Redis Logs**: Redis logs at `/var/log/redis/redis-server.log`
- **Docker Logs**: `docker-compose logs -f <service_name>`

## Next Steps

### 1. Complete Implementation
- [ ] Implement Appointment Booking
- [ ] Implement Queue Management
- [ ] Implement Medical Records
- [ ] Implement Symptom Triage
- [ ] Implement Referral System
- [ ] Implement Teleconsultation
- [ ] Implement Notification System

### 2. Enhancements
- [ ] Add input validation with Zod
- [ ] Add unit and integration tests
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add monitoring and metrics
- [ ] Add email/SMS notifications

### 3. Production Deployment
- [ ] Configure HTTPS
- [ ] Set up CI/CD pipeline
- [ ] Configure load balancing
- [ ] Set up backup strategy
- [ ] Implement monitoring (Prometheus, Grafana)
- [ ] Configure alerting

## Support

- **Documentation**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/api/health`
- **Issue Tracking**: GitHub repository issues
- **Email Support**: support@smarthealthcare.com

---

**Note**: This is a development setup. For production deployment, ensure proper security measures, monitoring, and backup strategies are in place.