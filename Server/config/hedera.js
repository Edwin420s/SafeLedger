const { Client } = require('@hashgraph/sdk');
const { HEDERA_NETWORK, HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY } = require('./env');

const client = HEDERA_NETWORK === 'mainnet' ? Client.forMainnet() : Client.forTestnet();

if (HEDERA_ACCOUNT_ID && HEDERA_PRIVATE_KEY) {
  client.setOperator(HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY);
} else {
  console.warn('Hedera credentials not found in environment variables');
}

module.exports = client;