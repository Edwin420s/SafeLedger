require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  HEDERA_NETWORK: process.env.HEDERA_NETWORK || 'testnet',
  HEDERA_ACCOUNT_ID: process.env.HEDERA_ACCOUNT_ID,
  HEDERA_PRIVATE_KEY: process.env.HEDERA_PRIVATE_KEY,
  HEDERA_TOPIC_ID: process.env.HEDERA_TOPIC_ID,
};