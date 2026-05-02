const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SafeLedger Backend...');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, '../node_modules'))) {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}

// Check Prisma client
try {
  require('@prisma/client');
  console.log('✅ Prisma client found');
} catch {
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}

// Check environment file
if (!fs.existsSync(path.join(__dirname, '../.env'))) {
  console.log('⚠️  .env file not found. Copying .env.example...');
  fs.copyFileSync(
    path.join(__dirname, '../.env.example'),
    path.join(__dirname, '../.env')
  );
  console.log('📝 Please update .env with your configuration');
}

// Compile Hedera contract
console.log('🔗 Compiling Hedera contract...');
execSync('node hedera/scripts/compileContract.js', { 
  stdio: 'inherit', 
  cwd: path.join(__dirname, '..') 
});

console.log('✅ Setup complete!');
console.log('');
console.log('Next steps:');
console.log('1. Update .env with your Hedera credentials');
console.log('2. Start PostgreSQL and Redis (use: docker-compose up)');
console.log('3. Run database migrations: npm run migrate');
console.log('4. Start the server: npm run dev');
