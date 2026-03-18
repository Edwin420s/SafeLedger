# SafeLedger Backend Changelog

## v1.0.0 - Initial Release

### Features
- ✅ User registration and JWT authentication
- ✅ Create loan agreements with encrypted terms
- ✅ SHA-256 hash generation and Hedera submission
- ✅ Payment tracking and recording
- ✅ Agreement verification against Hedera
- ✅ Daily due date reminders (Bull queue + cron)
- ✅ AES-256 encryption for sensitive data
- ✅ Comprehensive API with validation
- ✅ Docker support for PostgreSQL and Redis
- ✅ Prisma ORM with PostgreSQL
- ✅ Hedera smart contract integration
- ✅ Rate limiting and security middleware
- ✅ Structured logging with Winston

### Security Features
- 🔒 AES-256 encryption for personal data
- 🔒 JWT-based authentication
- 🔒 Rate limiting
- 🔒 Input validation with Joi
- 🔒 Helmet security headers
- 🔒 Hash-only storage on Hedera (compliant with data protection)

### API Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `POST /api/agreements` - Create agreement
- `GET /api/agreements` - List user agreements
- `GET /api/agreements/:id` - Get agreement details
- `PATCH /api/agreements/:id/sign` - Sign agreement
- `POST /api/payments` - Record payment
- `GET /api/payments/agreement/:agreementId` - Get payments
- `GET /api/hedera/verify/:id` - Verify agreement on Hedera
- `GET /health` - Health check

### Database Schema
- Users table with encrypted data
- Agreements table with hash storage
- Payments table with tracking
- Proper relationships and indexes

### Hedera Integration
- Topic creation for hash storage
- Smart contract deployment scripts
- Hash verification functionality

### Development Tools
- Auto-setup script
- Docker Compose configuration
- Environment templates
- PM2 ecosystem config
