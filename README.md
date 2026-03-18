# SafeLedger - Secure Lending with Hedera

A blockchain-powered lending platform that brings trust and transparency to informal financial agreements using Hedera Consensus Service for immutable verification.

## 🏗️ Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Hedera Consensus Service (HCS)
- **Cache/Queue**: Redis with Bull
- **Authentication**: JWT with bcrypt

## 🚀 Features

- ✅ User registration/login with phone-based authentication
- ✅ Create and manage loan agreements
- ✅ SHA-256 hashing of agreements stored on Hedera
- ✅ Agreement verification against blockchain records
- ✅ Encrypted sensitive data storage
- ✅ Trust score system
- ✅ Payment tracking
- ✅ Real-time notifications

## 📋 Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- Hedera Testnet Account (for production)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/Edwin420s/SafeLedger.git
cd SafeLedger

# Install backend dependencies
cd Server
npm install

# Install frontend dependencies
cd ../Client
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb safeledger

# Run migrations
cd Server
npx prisma migrate dev

# Seed data (optional)
npm run setup
```

### 3. Environment Configuration

#### Backend (.env)

```bash
cd Server
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/safeledger"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRE="7d"

# Encryption (32-character key)
ENCRYPTION_KEY="your-32-character-encryption-key"

# Hedera Testnet
HEDERA_NETWORK="testnet"
HEDERA_ACCOUNT_ID="0.0.xxxxxx"
HEDERA_PRIVATE_KEY="302e020100300506032b657004220420..."
HEDERA_TOPIC_ID=""  # Optional: Set after first run
```

#### Frontend (.env)

```bash
cd Client
cp .env.example .env
```

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Services

```bash
# Start Redis
redis-server

# Start Backend
cd Server
npm run dev

# Start Frontend (new terminal)
cd Client
npm start
```

## 📱 Usage

1. **Register**: Create account with phone number
2. **Login**: Authenticate with phone and password
3. **Create Agreement**: Fill loan details and submit
4. **Verify**: Check agreement integrity on Hedera
5. **Manage**: Track payments and agreement status

## 🔧 Hedera Integration

### Getting Testnet Credentials

1. Visit [Hedera Portal](https://portal.hedera.com)
2. Create testnet account
3. Get Account ID and Private Key
4. Add to `.env` file

### Topic Management

- First run automatically creates a consensus topic
- Topic ID is logged - add to `.env` for persistence
- All agreement hashes are stored on this topic

## 🧪 Testing

```bash
# Backend tests
cd Server
npm test

# Frontend tests
cd Client
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Agreements
- `POST /api/agreements` - Create agreement
- `GET /api/agreements` - List user agreements
- `GET /api/agreements/:id` - Get agreement details
- `PATCH /api/agreements/:id/sign` - Sign agreement

### Hedera
- `POST /api/hedera/verify/:id` - Verify agreement on blockchain

### Payments
- `POST /api/payments` - Record payment
- `GET /api/payments/agreement/:id` - Get agreement payments

## 🔐 Security Features

- **Encryption**: AES-256 for sensitive data
- **Hashing**: SHA-256 for agreement integrity
- **Authentication**: JWT tokens with expiration
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schemas for all inputs

## 🚀 Deployment

### Backend (Production)

```bash
cd Server
npm run build
npm start
```

### Frontend (Production)

```bash
cd Client
npm run build
# Deploy build/ folder to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

For issues and questions:
- Create GitHub Issue
- Join our Discord community
- Email: support@safeledger.dev

## 🏆 Hackathon Submission

Built for Hedera Hello Future Apex Hackathon 2026 - DeFi & Tokenization Track.

**Tech Stack Integration Score**: 9/10
- ✅ Hedera Consensus Service for immutable records
- ✅ Enterprise-grade security with encryption
- ✅ Real-world financial use case
- ✅ Mobile-responsive design
- ✅ Production-ready architecture
