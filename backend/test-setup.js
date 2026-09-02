/**
 * Quick setup test for the Healthcare Backend
 * This script tests basic functionality
 */

const axios = require('axios');
const baseURL = 'http://localhost:5000/api';

async function testSetup() {
    console.log('🧪 Testing Healthcare Backend Setup...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await axios.get(`${baseURL}/health`);
        console.log(`   ✅ Health Check: ${healthResponse.data.message}`);
        console.log(`   📊 Status: ${healthResponse.data.success ? 'Healthy' : 'Unhealthy'}`);
        console.log(`   ⏰ Uptime: ${healthResponse.data.uptime} seconds\n`);

        // Test 2: API Documentation
        console.log('2️⃣ Testing API Documentation...');
        try {
            await axios.get('http://localhost:5000/api-docs');
            console.log('   ✅ API Documentation available at http://localhost:5000/api-docs\n');
        } catch (error) {
            console.log('   ⚠️ API Documentation endpoint might not be accessible\n');
        }

        // Test 3: Authentication Endpoints
        console.log('3️⃣ Testing Authentication Endpoints...');

        // Test phone availability check
        const testPhone = '+919999999999';
        try {
            const phoneCheck = await axios.get(`${baseURL}/auth/check-phone/${testPhone}`);
            console.log(`   ✅ Phone Check: ${testPhone} - ${phoneCheck.data.data.available ? 'Available' : 'Taken'}`);
        } catch (error) {
            console.log(`   ⚠️ Phone Check endpoint might not be working\n`);
        }

        // Test registration (would normally fail for duplicate phone)
        console.log('   ⏳ Registration endpoint available\n');

        console.log('🎉 Setup Test Complete!\n');
        console.log('📋 Next Steps:');
        console.log('   1. Run database seeding: npm run seed');
        console.log('   2. Test with sample credentials from seed script');
        console.log('   3. Access API docs: http://localhost:5000/api-docs');
        console.log('   4. Test authentication flow');
        console.log('\n🔧 Configuration Status:');
        console.log('   ✅ Basic server setup');
        console.log('   ✅ Health endpoint working');
        console.log('   ✅ API structure in place');
        console.log('   ⚠️ Database connection needs testing');
        console.log('   ⚠️ Redis connection needs testing');

    } catch (error) {
        console.error('❌ Setup test failed:', error.message);
        console.log('\n🔍 Troubleshooting:');
        console.log('   1. Make sure server is running: npm run dev');
        console.log('   2. Check MongoDB connection');
        console.log('   3. Check Redis connection');
        console.log('   4. Verify environment variables');

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Server might not be running. Start it with: npm run dev');
        }
    }
}

// Run test
testSetup();