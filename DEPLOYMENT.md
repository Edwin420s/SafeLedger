# 🚀 SafeLedger Deployment Guide

## 📋 Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- Redis 6+
- Hedera Testnet Account
- Docker & Docker Compose (recommended)

## 🐳 Docker Deployment (Recommended)

### 1. Environment Setup

```bash
# Clone repository
git clone https://github.com/Edwin420s/SafeLedger.git
cd SafeLedger

# Backend environment
cd Server
cp .env.example .env
# Edit .env with your credentials

# Frontend environment  
cd ../Client
cp .env.example .env
# Edit .env with backend URL
```

### 2. Start Services

```bash
# Start database and Redis
cd Server
docker-compose up -d

# Install dependencies
npm install

# Database migrations
npx prisma migrate dev

# Seed database (optional)
npm run setup

# Start backend
npm run dev
```

### 3. Start Frontend

```bash
cd Client
npm install
npm start
```

## 🏗️ Manual Deployment

### Backend Setup

```bash
cd Server

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Configure with your settings

# Start PostgreSQL and Redis
# Make sure they're running on default ports

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```

### Frontend Setup

```bash
cd Client

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Set REACT_APP_API_BASE_URL

# Start development server
npm start
```

## 🔧 Hedera Configuration

### 1. Get Testnet Credentials

1. Visit [Hedera Portal](https://portal.hedera.com)
2. Create testnet account
3. Note Account ID and Private Key

### 2. Update Environment

```env
HEDERA_NETWORK="testnet"
HEDERA_ACCOUNT_ID="0.0.xxxxxx"
HEDERA_PRIVATE_KEY="302e020100300506032b657004220420..."
```

### 3. Deploy Smart Contract (Optional)

```bash
cd Server

# Compile contract
node hedera/scripts/compileContract.js

# Deploy contract
node hedera/scripts/deployContract.js
```

## 🌐 Production Deployment

### Backend Production

```bash
cd Server

# Build for production
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Or with Node.js
NODE_ENV=production npm start
```

### Frontend Production

```bash
cd Client

# Build static files
npm run build

# Deploy to web server
# Upload build/ folder to your hosting service
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
REDIS_URL="redis://host:6379"
JWT_SECRET="strong-production-secret"
ENCRYPTION_KEY="32-character-production-key"
HEDERA_NETWORK="mainnet"  # When ready for mainnet
```

## 🔍 Health Checks

### Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok"}
```

### Database Connection

```bash
cd Server
npx prisma db pull
```

### Redis Connection

```bash
redis-cli ping
```

## 📊 Monitoring

### Logs

- Backend logs: `Server/combined.log`
- Error logs: `Server/error.log`
- Database logs: Check PostgreSQL logs

### PM2 Monitoring (if using)

```bash
pm2 list
pm2 logs safeledger-backend
pm2 monit
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use strong passwords and SSL
3. **API**: Enable HTTPS in production
4. **Hedera**: Use mainnet credentials carefully
5. **Rate Limiting**: Already configured in middleware
6. **Input Validation**: Joi schemas for all inputs

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL format
   - Check credentials

2. **Redis Connection Failed**
   - Ensure Redis server is running
   - Check REDIS_URL format
   - Verify port accessibility

3. **Hedera Transaction Failed**
   - Verify account balance
   - Check network (testnet/mainnet)
   - Validate account ID format

4. **Frontend API Errors**
   - Check REACT_APP_API_BASE_URL
   - Verify CORS configuration
   - Ensure backend is running

### Debug Mode

```bash
# Backend debug
DEBUG=* npm run dev

# Frontend debug
REACT_APP_API_BASE_URL=http://localhost:5000/api npm start
```

## 📈 Scaling

### Horizontal Scaling

- Use load balancer for multiple backend instances
- Configure Redis cluster for session storage
- Use read replicas for database

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement caching strategies

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy SafeLedger
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploy to your server"
```

## 📞 Support

For deployment issues:
1. Check logs for error messages
2. Verify environment configuration
3. Test individual components
4. Create GitHub issue with details

---

**Happy Deploying! 🎉**
