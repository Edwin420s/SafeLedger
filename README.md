# SafeLedger - Secure Lending with Hedera

A blockchain-powered lending platform that brings trust and transparency to informal financial agreements using Hedera Consensus Service for immutable verification.

## 🏆 Hedera Hello Future Apex Hackathon 2026

**Track**: DeFi & Tokenization  
**Prize Pool**: $250,000  
**Submission Deadline**: March 23, 2026, 11:59 PM ET  

### 🎯 Problem Statement
Millions of people in Kenya and across Africa rely on informal financial systems (chamas, friends/family loans, SACCOs) but lack a trust infrastructure to support these relationships. This leads to:

- No verifiable agreements (verbal/WhatsApp chats only)
- No reputation system for borrowers
- No enforcement mechanisms beyond social pressure
- Fragmented financial data across platforms
- High risk of defaults and relationship breakdowns

### 💡 Solution Overview
SafeLedger creates a **trust layer for informal finance** by:
- **Immutable Agreement Storage**: SHA-256 hashes anchored on Hedera blockchain
- **Cryptographic Verification**: Tamper-proof agreement integrity
- **Trust Score System**: Reputation building through successful transactions
- **Encrypted Data Storage**: AES-256 protection for sensitive information
- **Mobile-First Design**: Phone-based authentication for accessibility

### 🌍 Impact & Innovation
- **Local Context**: Built for Kenyan market (KES currency, phone formats)
- **Financial Inclusion**: Enables trust in underserved communities
- **Blockchain Integration**: Real-world use of Hedera Consensus Service
- **Scalable Architecture**: Ready for regional expansion
- **Social Impact**: Reduces poverty cycles through credit access

---

## Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Hedera Consensus Service (HCS)
- **Cache/Queue**: Redis with Bull
- **Authentication**: JWT with bcrypt

## Features

### 🔐 Security & Trust
- User registration/login with phone-based authentication
- SHA-256 hashing of agreements stored on Hedera
- Agreement verification against blockchain records
- Encrypted sensitive data storage (AES-256)
- Trust score system based on transaction history

### 💼 Loan Management
- Create and manage loan agreements
- Borrower acceptance/rejection workflow
- Payment tracking with timestamps
- Agreement status management (PENDING → ACTIVE → COMPLETED/DEFAULTED)

### 🌐 Blockchain Integration
- **Hedera Consensus Service**: Immutable hash storage
- **Automatic Topic Creation**: Self-managing HCS topics
- **Transaction Verification**: Real-time blockchain verification
- **Error Handling**: Robust fallback mechanisms

### 📱 User Experience
- Mobile-responsive design
- Phone number lookup for borrowers
- Real-time notifications
- Intuitive dashboard interface

## Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- Hedera Testnet Account

## Quick Start

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
# Using Docker (recommended)
cd Server
docker-compose up -d

# Or manual setup
createdb safeledger
cd Server
npx prisma migrate dev
npm run setup
```

### 3. Environment Configuration

#### Backend (.env)
```bash
cd Server
cp .env.example .env
# Edit .env with your credentials
```

#### Frontend (.env)
```bash
cd Client
cp .env.example .env
```

### 4. Start Services

```bash
# Start Redis and PostgreSQL (if not using Docker)
redis-server

# Start Backend
cd Server
npm run dev

# Start Frontend (new terminal)
cd Client
npm start
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

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

## API Documentation

### Interactive Documentation
Visit http://localhost:5000/api-docs for interactive Swagger/OpenAPI documentation.

### Key Endpoints

#### Authentication
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

#### Agreements
- `POST /api/agreements` - Create agreement
- `GET /api/agreements` - List user agreements
- `GET /api/agreements/:id` - Get agreement details
- `PATCH /api/agreements/:id/sign` - Sign agreement
- `PATCH /api/agreements/:id/accept` - Accept agreement
- `PATCH /api/agreements/:id/reject` - Reject agreement

#### Hedera
- `POST /api/hedera/verify/:id` - Verify agreement on blockchain

#### Payments
- `POST /api/payments` - Record payment
- `GET /api/payments/agreement/:id` - Get agreement payments

## Testing

### Backend Tests
```bash
cd Server
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Test Coverage
- Unit tests for core services (hashing, encryption, validation)
- Integration tests for API endpoints
- Security tests for authentication and authorization
- Hedera service mocking for reliable testing

## Security Features

### Encryption & Hashing
- **AES-256-GCM**: Sensitive data encryption
- **SHA-256**: Agreement integrity hashing
- **bcrypt**: Password hashing
- **JWT**: Secure authentication tokens

### API Security
- **Rate Limiting**: 100 requests/15 minutes
- **Input Validation**: Joi schemas for all endpoints
- **CORS**: Cross-origin request protection
- **Helmet**: Security headers

### Blockchain Security
- **Immutability**: Once recorded, cannot be changed
- **Cryptographic Proof**: Verifiable integrity
- **Decentralization**: Hedera network validation

## Deployment

### Production Deployment

#### Backend
```bash
cd Server
npm run build
npm start
```

#### Frontend
```bash
cd Client
npm run build
# Deploy build/ folder to your web server
```

#### Docker Deployment
```bash
cd Server
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
- `NODE_ENV`: Set to 'production'
- `DATABASE_URL`: Production PostgreSQL connection
- `REDIS_URL`: Production Redis connection
- `HEDERA_NETWORK`: Set to 'mainnet' for production
- `JWT_SECRET`: Strong secret key
- `ENCRYPTION_KEY`: 32-character encryption key

## Performance Monitoring

### Health Checks
- `GET /health` - Application health status
- `GET /api-docs` - API documentation
- Database connection monitoring
- Redis connection monitoring

### Metrics
- Request/response times
- Error rates
- Database query performance
- Hedera transaction success rates

## Development

### Project Structure
```
SafeLedger/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
├── Server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── services/         # Business logic
│   ├── routes/          # API routes
│   ├── middlewares/     # Express middleware
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── tests/          # Test files
├── docs/               # Documentation
└── database/           # Database files
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## Hackathon Submission

### Technical Stack
- **Blockchain**: Hedera Consensus Service (HCS)
- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Security**: JWT, AES-256, SHA-256

### Innovation Points
- **Real-World Problem**: Addresses informal finance trust gap in Kenya
- **Blockchain Integration**: Practical use of Hedera for immutability
- **Mobile-First**: Phone-based authentication for accessibility
- **Trust System**: Reputation building through blockchain verification
- **Local Context**: Kenya-specific implementation

### Impact Metrics
- **Financial Inclusion**: Enables trust in underserved communities
- **Risk Reduction**: Immutable agreements reduce disputes
- **Credit Building**: Trust scores enable future financial access
- **Scalability**: Architecture ready for regional expansion

### Demo Features
- Complete user registration and authentication
- Agreement creation with Hedera hash anchoring
- Blockchain verification interface
- Payment tracking and management
- Trust score system demonstration

## Support

For issues and questions:
- Create GitHub Issue
- Email: support@safeledger.dev
- Documentation: [User Guide](docs/USER_GUIDE.md)

## License

MIT License - see LICENSE file

---

**Built for Hedera Hello Future Apex Hackathon 2026 - DeFi & Tokenization Track**

🚀 **Bringing trust to informal finance, one blockchain transaction at a time**
