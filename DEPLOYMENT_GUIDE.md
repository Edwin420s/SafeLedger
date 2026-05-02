# SafeLedger Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository
Your SafeLedger project is now configured for Vercel deployment with the following additions:
- `vercel.json` - Vercel configuration
- `Server/api/index.js` - Serverless API entry point
- `.env.example` - Environment variables template

### 2. Deploy to Vercel

#### Method 1: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository: `Edwin420s/SafeLedger`
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave default)
   - **Project Name**: `safe-ledger`

#### Method 2: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd /path/to/SafeLedger
vercel --prod
```

### 3. Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

#### Required Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/safeledger"

# Redis (if using external Redis)
REDIS_URL="redis://user:password@host:6379"

# JWT & Security
JWT_SECRET="your-super-secure-jwt-secret-key-for-production"
JWT_EXPIRE="7d"
ENCRYPTION_KEY="my-32-character-encryption-key!!"

# Hedera Blockchain
HEDERA_NETWORK="testnet"  # Change to "mainnet" for production
HEDERA_ACCOUNT_ID="0.0.xxxxxx"
HEDERA_PRIVATE_KEY="302e020100300506032b657004220420..."
HEDERA_TOPIC_ID=""  # Optional: Set after first deployment
```

#### Optional Variables
```bash
# M-Pesa Integration
MPESA_CONSUMER_KEY=""
MPESA_CONSUMER_SECRET=""
MPESA_PASSKEY=""
MPESA_SHORTCODE=""

# Application
NODE_ENV="production"
PORT="5000"
```

### 4. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to **Storage → Create Database**
2. Choose **Postgres**
3. Create database and copy the `DATABASE_URL`
4. Add to environment variables
5. Run database migrations (see step 6)

#### Option B: External Database
1. Set up PostgreSQL with any provider (Railway, Supabase, etc.)
2. Add connection string to environment variables

### 5. Redis Setup (Optional)

#### Option A: Vercel KV
1. In Vercel dashboard, go to **Storage → Create Database**
2. Choose **KV (Redis)**
3. Create and add `REDIS_URL` to environment variables

#### Option B: External Redis
1. Use Redis Cloud, Upstash, or similar
2. Add connection string to environment variables

### 6. Database Migration

After deployment, you need to run database migrations:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Run migrations
vercel env pull .env.production
cd Server
npx prisma migrate deploy
npx prisma generate
```

Or use the Vercel web interface to run a one-off command.

### 7. Hedera Setup

1. Get Hedera testnet credentials:
   - Visit [Hedera Portal](https://portal.hedera.com)
   - Create testnet account
   - Copy Account ID and Private Key

2. Add credentials to Vercel environment variables

3. After first deployment, check logs for the automatically created topic ID and add it to environment variables for persistence.

## 🌐 Access Your Application

Once deployed:
- **Frontend**: `https://safe-ledger.vercel.app`
- **API**: `https://safe-ledger.vercel.app/api`
- **Health Check**: `https://safe-ledger.vercel.app/api/health`
- **API Docs**: `https://safe-ledger.vercel.app/api` (root endpoint)

## 🔧 Configuration Details

### Vercel Configuration (`vercel.json`)
- Frontend builds with `@vercel/static-build`
- Backend deployed as serverless functions
- API routes prefixed with `/api`
- Static assets served from Client build

### Serverless API Structure
- `Server/api/index.js` - Main API entry point
- All routes preserved: `/api/users`, `/api/agreements`, `/api/payments`, `/api/hedera`
- 30-second function timeout for blockchain operations

### Frontend Configuration
- API calls automatically routed to `/api`
- Environment variables loaded at runtime
- React Router for client-side navigation

## 🚨 Important Notes

### Database Limitations
- Vercel Postgres has connection limits
- Consider connection pooling for high traffic
- Database migrations must be run manually after deployment

### Performance Considerations
- Serverless functions have cold starts
- Hedera blockchain operations may take 5-10 seconds
- Consider caching frequently accessed data

### Security
- All environment variables are encrypted in Vercel
- Never commit secrets to git
- Use strong JWT secrets in production

### Monitoring
- Check Vercel Analytics for performance
- Monitor function execution logs
- Set up alerts for errors

## 🛠 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel
- Ensure SSL is enabled for external databases

#### 2. Hedera API Errors
- Verify Hedera credentials are correct
- Check network is set to "testnet" or "mainnet"
- Ensure topic ID is set after first deployment

#### 3. Function Timeouts
- Increase timeout in `vercel.json` if needed
- Optimize heavy operations
- Consider background jobs for long tasks

#### 4. Build Failures
- Check all dependencies are in package.json
- Verify environment variables are set
- Review build logs in Vercel dashboard

### Debugging Steps
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Review database connection
5. Check Hedera network status

## 📈 Production Checklist

Before going live:

- [ ] Set `HEDERA_NETWORK="mainnet"`
- [ ] Use production database
- [ ] Set up monitoring and alerts
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Test all functionality
- [ ] Backup database regularly
- [ ] Monitor costs and usage

## 🆘 Support

For issues:
1. Check Vercel deployment logs
2. Review this guide
3. Create GitHub issue
4. Email: support@safeledger.dev

---

**🚀 Your SafeLedger application is ready for Vercel deployment!**
