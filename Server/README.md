# SafeLedger Backend

Hedera-powered secure lending platform backend. Enables creation of loan agreements, encrypted storage, and immutable proof on Hedera.

## Features
- User registration & JWT authentication
- Create loan agreements with encrypted terms
- SHA-256 hash of agreements stored on Hedera Consensus Service
- Payment tracking
- Agreement verification against Hedera
- Daily due date reminders (cron job)
- Compliant with Kenya Data Protection Act (data off-chain, hashes only on-chain)

## Tech Stack
- Node.js + Express
- PostgreSQL (via Prisma ORM)
- Redis (for queues/caching – optional)
- Hedera Hashgraph SDK
- Bull (for job queues – optional)
- JWT, bcrypt, AES-256 encryption

## Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (optional for Bull)
- Hedera testnet account (get free HBAR from [Hedera portal](https://portal.hedera.com/))

## Setup

1. Clone the repository
2. Install dependencies: