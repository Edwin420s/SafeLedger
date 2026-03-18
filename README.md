# SafeLedger - Secure Lending with Hedera

A blockchain-powered lending platform that brings trust and transparency to informal financial agreements using Hedera Consensus Service for immutable verification.

## Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Hedera Consensus Service (HCS)
- **Cache/Queue**: Redis with Bull
- **Authentication**: JWT with bcrypt

## Features

- User registration/login with phone-based authentication
- Create and manage loan agreements
- SHA-256 hashing of agreements stored on Hedera
- Agreement verification against blockchain records
- Encrypted sensitive data storage
- Trust score system
- Payment tracking
- Real-time notifications

## Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- Hedera Testnet Account

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/Edwin420s/SafeLedger.git
cd SafeLedger

# Backend
cd Server
npm install

# Frontend
cd ../Client
npm install
```

### 2. Database Setup

```bash
# Create database
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

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/safeledger"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
JWT_EXPIRE="7d"
ENCRYPTION_KEY="your-32-character-encryption-key"
HEDERA_NETWORK="testnet"
HEDERA_ACCOUNT_ID="0.0.xxxxxx"
HEDERA_PRIVATE_KEY="302e020100300506032b657004220420..."
HEDERA_TOPIC_ID=""
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

## Usage

1. **Register**: Create account with phone number
2. **Login**: Authenticate with phone and password
3. **Create Agreement**: Fill loan details and submit
4. **Verify**: Check agreement integrity on Hedera
5. **Manage**: Track payments and agreement status

## Hedera Integration

### Getting Testnet Credentials

1. Visit [Hedera Portal](https://portal.hedera.com)
2. Create testnet account
3. Get Account ID and Private Key
4. Add to `.env` file

### Topic Management

- First run automatically creates a consensus topic
- Topic ID is logged - add to `.env` for persistence
- All agreement hashes are stored on this topic

## API Endpoints

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

## Security Features

- **Encryption**: AES-256 for sensitive data
- **Hashing**: SHA-256 for agreement integrity
- **Authentication**: JWT tokens with expiration
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schemas for all inputs

## Deployment

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

## Testing

```bash
# Backend tests
cd Server
npm test

# Frontend tests
cd Client
npm test
```

## License

MIT License - see LICENSE file

## Support

For issues and questions:
- Create GitHub Issue
- Email: support@safeledger.dev

## Hackathon Submission

Built for Hedera Hello Future Apex Hackathon 2026 - DeFi & Tokenization Track.
