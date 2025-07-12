const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('Testing database connection...\n');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`\n📊 Database statistics:`);
    console.log(`   - Users: ${userCount}`);
    
    const coupleCount = await prisma.couple.count();
    console.log(`   - Couples: ${coupleCount}`);
    
    const eventCount = await prisma.event.count();
    console.log(`   - Events: ${eventCount}`);
    
    const budgetCount = await prisma.budgetItem.count();
    console.log(`   - Budget Items: ${budgetCount}`);
    
    console.log('\n✅ Database is working properly!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Ensure PostgreSQL is running');
    console.error('2. Check DATABASE_URL in .env file');
    console.error('3. Run: docker compose up -d');
    console.error('4. Run: npx prisma migrate dev');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();