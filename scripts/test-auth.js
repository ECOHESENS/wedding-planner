const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('Testing authentication...\n');
    
    // Test database connection
    console.log('1. Testing database connection...');
    const userCount = await prisma.user.count();
    console.log(`   ✓ Database connected. Found ${userCount} users.\n`);
    
    // Test user lookup
    console.log('2. Testing user lookup...');
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (testUser) {
      console.log(`   ✓ Found test user: ${testUser.name} (${testUser.email})`);
      console.log(`   ✓ User role: ${testUser.role}`);
      console.log(`   ✓ User ID: ${testUser.id}\n`);
    } else {
      console.log('   ✗ Test user not found\n');
    }
    
    // Test password verification
    console.log('3. Testing password verification...');
    if (testUser) {
      const isValid = await bcrypt.compare('password123', testUser.password);
      console.log(`   ${isValid ? '✓' : '✗'} Password verification: ${isValid}\n`);
    }
    
    // Test environment variables
    console.log('4. Testing environment variables...');
    console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
    console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing'}`);
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✓ Set' : '✗ Missing'}\n`);
    
    console.log('Authentication test completed!');
    
  } catch (error) {
    console.error('Error during authentication test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();