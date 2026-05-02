const { Client } = require('@hashgraph/sdk');
const { HEDERA_NETWORK, HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY } = require('./env');

const client = HEDERA_NETWORK === 'mainnet' ? Client.forMainnet() : Client.forTestnet();

if (HEDERA_ACCOUNT_ID && HEDERA_PRIVATE_KEY && HEDERA_ACCOUNT_ID.trim() !== '' && HEDERA_PRIVATE_KEY.trim() !== '') {
  try {
    client.setOperator(HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY);
    console.log('Hedera client configured successfully');
  } catch (error) {
    console.warn('Error setting Hedera operator:', error.message);
  }
} else {
  console.warn('Hedera credentials not found or empty - running in mock mode');
}

module.exports = client;