require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');

// Import models
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Facility = require('../models/Facility');

/**
 * Seed database with sample data
 */
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Doctor.deleteMany({});
        await Facility.deleteMany({});
        console.log('✅ Existing data cleared');

        // Create admin user
        console.log('👨‍💼 Creating admin user...');
        const adminPassword = await bcrypt.hash('Admin@123', 12);
        const adminUser = await User.create({
            name: 'Admin User',
            phone: '+919999999999',
            email: 'admin@smarthealthcare.com',
            password: adminPassword,
            role: 'admin',
            isPhoneVerified: true,
        });
        console.log('✅ Admin user created');

        // Create facilities
        console.log('🏥 Creating facilities...');
        const facilities = [
            {
                name: 'City General Hospital',
                facilityType: 'District Hospital',
                phone: '+912244112233',
                email: 'info@citygeneral.com',
                address: {
                    street: '123 Main Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                },
                location: {
                    type: 'Point',
                    coordinates: [72.8777, 19.0760], // Mumbai
                },
                services: [
                    { name: 'Emergency', available: true },
                    { name: 'General Consultation', available: true },
                    { name: 'Laboratory', available: true },
                    { name: 'Pharmacy', available: true },
                ],
                diagnosticFacilities: [
                    { name: 'X-Ray', testType: 'imaging', available: true },
                    { name: 'Blood Test', testType: 'blood', available: true },
                ],
                totalBeds: 200,
                availableBeds: 50,
                icuBeds: 20,
                totalDoctors: 50,
                totalNurses: 100,
                emergencyServices: true,
                emergencyContact: '+912244112234',
                isVerified: true,
                averageRating: 4.5,
                totalReviews: 150,
            },
            {
                name: 'Primary Health Center (PHC)',
                facilityType: 'PHC',
                phone: '+912244112244',
                email: 'info@phc.com',
                address: {
                    street: '456 Village Road',
                    city: 'Thane',
                    state: 'Maharashtra',
                    pincode: '400601',
                },
                location: {
                    type: 'Point',
                    coordinates: [72.9714, 19.2183], // Thane
                },
                services: [
                    { name: 'General Consultation', available: true },
                    { name: 'Vaccination', available: true },
                    { name: 'Maternal Care', available: true },
                ],
                diagnosticFacilities: [
                    { name: 'Basic Blood Test', testType: 'blood', available: true },
                    { name: 'Urine Test', testType: 'urine', available: true },
                ],
                totalBeds: 20,
                availableBeds: 15,
                totalDoctors: 5,
                totalNurses: 10,
                emergencyServices: false,
                isVerified: true,
                averageRating: 4.0,
                totalReviews: 80,
            },
            {
                name: 'Community Health Center (CHC)',
                facilityType: 'CHC',
                phone: '+912244112255',
                email: 'info@chc.com',
                address: {
                    street: '789 Community Road',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411001',
                },
                location: {
                    type: 'Point',
                    coordinates: [73.8567, 18.5204], // Pune
                },
                services: [
                    { name: 'General Consultation', available: true },
                    { name: 'Pediatrics', available: true },
                    { name: 'Dental Care', available: true },
                    { name: 'Physiotherapy', available: true },
                ],
                diagnosticFacilities: [
                    { name: 'X-Ray', testType: 'imaging', available: true },
                    { name: 'ECG', testType: 'ecg', available: true },
                    { name: 'Ultrasound', testType: 'ultrasound', available: true },
                ],
                totalBeds: 50,
                availableBeds: 30,
                icuBeds: 5,
                totalDoctors: 15,
                totalNurses: 30,
                emergencyServices: true,
                emergencyContact: '+912244112256',
                isVerified: true,
                averageRating: 4.2,
                totalReviews: 120,
            },
        ];

        const createdFacilities = await Facility.insertMany(facilities);
        console.log(`✅ ${createdFacilities.length} facilities created`);

        // Create doctors
        console.log('👨‍⚕️ Creating doctors...');
        const doctors = [
            {
                name: 'Dr. Rajesh Kumar',
                phone: '+919876543210',
                email: 'dr.rajesh@example.com',
                password: await bcrypt.hash('Doctor@123', 12),
                role: 'doctor',
                isPhoneVerified: true,
                doctorName: 'Dr. Rajesh Kumar',
                specialization: 'General Physician',
                qualification: 'MBBS, MD',
                experience: 10,
                facility: createdFacilities[0]._id,
                consultationFee: 500,
                isAvailable: true,
                availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                isVerified: true,
            },
            {
                name: 'Dr. Priya Sharma',
                phone: '+919876543211',
                email: 'dr.priya@example.com',
                password: await bcrypt.hash('Doctor@123', 12),
                role: 'doctor',
                isPhoneVerified: true,
                doctorName: 'Dr. Priya Sharma',
                specialization: 'Pediatrics',
                qualification: 'MBBS, MD (Pediatrics)',
                experience: 8,
                facility: createdFacilities[1]._id,
                consultationFee: 400,
                isAvailable: true,
                availableDays: ['monday', 'wednesday', 'friday'],
                isVerified: true,
            },
            {
                name: 'Dr. Amit Patel',
                phone: '+919876543212',
                email: 'dr.amit@example.com',
                password: await bcrypt.hash('Doctor@123', 12),
                role: 'doctor',
                isPhoneVerified: true,
                doctorName: 'Dr. Amit Patel',
                specialization: 'Cardiology',
                qualification: 'MBBS, MD, DM (Cardiology)',
                experience: 15,
                facility: createdFacilities[2]._id,
                consultationFee: 800,
                isAvailable: true,
                availableDays: ['tuesday', 'thursday', 'saturday'],
                isVerified: true,
            },
        ];

        const createdDoctorUsers = await User.insertMany(
            doctors.map(doc => ({
                name: doc.name,
                phone: doc.phone,
                email: doc.email,
                password: doc.password,
                role: doc.role,
                isPhoneVerified: doc.isPhoneVerified,
            }))
        );

        const doctorProfiles = await Doctor.insertMany(
            doctors.map((doc, index) => ({
                user: createdDoctorUsers[index]._id,
                doctorName: doc.doctorName,
                specialization: doc.specialization,
                qualification: doc.qualification,
                experience: doc.experience,
                facility: doc.facility,
                consultationFee: doc.consultationFee,
                isAvailable: doc.isAvailable,
                availableDays: doc.availableDays,
                isVerified: doc.isVerified,
            }))
        );
        console.log(`✅ ${doctorProfiles.length} doctors created`);

        // Create patients
        console.log('👤 Creating patients...');
        const patients = [
            {
                name: 'John Doe',
                phone: '+919876543213',
                email: 'john.doe@example.com',
                password: await bcrypt.hash('Patient@123', 12),
                role: 'patient',
                isPhoneVerified: true,
                fullName: 'John Doe',
                dateOfBirth: new Date('1985-05-15'),
                gender: 'male',
                bloodGroup: 'O+',
                address: {
                    street: '101 Patient Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400002',
                },
                emergencyContact: {
                    name: 'Jane Doe',
                    relationship: 'spouse',
                    phone: '+919876543214',
                },
                allergies: [
                    {
                        allergen: 'Penicillin',
                        severity: 'severe',
                        reaction: 'Anaphylaxis',
                    },
                ],
                chronicDiseases: [
                    {
                        disease: 'Hypertension',
                        diagnosedDate: new Date('2018-03-10'),
                        status: 'controlled',
                        medications: ['Amlodipine 5mg'],
                    },
                ],
            },
            {
                name: 'Ramesh Kumar',
                phone: '+919876543215',
                email: 'ramesh.kumar@example.com',
                password: await bcrypt.hash('Patient@123', 12),
                role: 'patient',
                isPhoneVerified: true,
                fullName: 'Ramesh Kumar',
                dateOfBirth: new Date('1978-11-22'),
                gender: 'male',
                bloodGroup: 'A+',
                address: {
                    street: '202 Patient Lane',
                    city: 'Thane',
                    state: 'Maharashtra',
                    pincode: '400602',
                },
                emergencyContact: {
                    name: 'Sita Kumar',
                    relationship: 'spouse',
                    phone: '+919876543216',
                },
                chronicDiseases: [
                    {
                        disease: 'Type 2 Diabetes',
                        diagnosedDate: new Date('2015-07-20'),
                        status: 'controlled',
                        medications: ['Metformin 500mg'],
                    },
                ],
            },
            {
                name: 'Priya Sharma',
                phone: '+919876543217',
                email: 'priya.sharma@example.com',
                password: await bcrypt.hash('Patient@123', 12),
                role: 'patient',
                isPhoneVerified: true,
                fullName: 'Priya Sharma',
                dateOfBirth: new Date('1992-02-28'),
                gender: 'female',
                bloodGroup: 'B+',
                address: {
                    street: '303 Patient Road',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411002',
                },
                emergencyContact: {
                    name: 'Rahul Sharma',
                    relationship: 'husband',
                    phone: '+919876543218',
                },
                allergies: [
                    {
                        allergen: 'Dust',
                        severity: 'moderate',
                        reaction: 'Sneezing, runny nose',
                    },
                ],
            },
        ];

        const createdPatientUsers = await User.insertMany(
            patients.map(patient => ({
                name: patient.name,
                phone: patient.phone,
                email: patient.email,
                password: patient.password,
                role: patient.role,
                isPhoneVerified: patient.isPhoneVerified,
            }))
        );

        const patientProfiles = await Patient.insertMany(
            patients.map((patient, index) => ({
                user: createdPatientUsers[index]._id,
                fullName: patient.fullName,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                bloodGroup: patient.bloodGroup,
                phone: patient.phone,
                email: patient.email,
                address: patient.address,
                emergencyContact: patient.emergencyContact,
                allergies: patient.allergies || [],
                chronicDiseases: patient.chronicDiseases || [],
            }))
        );
        console.log(`✅ ${patientProfiles.length} patients created`);

        // Create health worker
        console.log('👩‍⚕️ Creating health worker...');
        const healthWorkerPassword = await bcrypt.hash('HealthWorker@123', 12);
        const healthWorkerUser = await User.create({
            name: 'Health Worker',
            phone: '+919876543219',
            email: 'health.worker@example.com',
            password: healthWorkerPassword,
            role: 'health_worker',
            isPhoneVerified: true,
        });
        console.log('✅ Health worker created');

        // Display summary
        console.log('\n📊 Database Seeding Summary:');
        console.log('============================');
        console.log(`👑 Admin Users: 1`);
        console.log(`👨‍⚕️ Doctors: ${createdDoctorUsers.length}`);
        console.log(`👤 Patients: ${createdPatientUsers.length}`);
        console.log(`👩‍⚕️ Health Workers: 1`);
        console.log(`🏥 Facilities: ${createdFacilities.length}`);
        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n🔑 Sample Login Credentials:');
        console.log('===========================');
        console.log('Admin:');
        console.log('  Phone: +919999999999');
        console.log('  Password: Admin@123');
        console.log('\nDoctor (Dr. Rajesh Kumar):');
        console.log('  Phone: +919876543210');
        console.log('  Password: Doctor@123');
        console.log('\nPatient (John Doe):');
        console.log('  Phone: +919876543213');
        console.log('  Password: Patient@123');
        console.log('\n🌐 API Documentation: http://localhost:5000/api-docs');

    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔻 Database connection closed');
    }
}

// Run seeding
seedDatabase();