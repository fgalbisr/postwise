const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up PostWise database...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Run database migrations
  console.log('🗄️  Running database migrations...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  // Seed the database with sample data
  console.log('🌱 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('✅ Database setup complete!');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}
