const { Client, AccountId, PrivateKey } = require('@hashgraph/sdk');
const env = require('./env');

let client;

if (env.HEDERA_ACCOUNT_ID && env.HEDERA_PRIVATE_KEY) {
  const accountId = AccountId.fromString(env.HEDERA_ACCOUNT_ID);
  const privateKey = PrivateKey.fromString(env.HEDERA_PRIVATE_KEY);

  client = Client.forTestnet(); // or mainnet
  client.setOperator(accountId, privateKey);
} else {
  console.warn('Hedera credentials missing, using dummy client');
  client = Client.forTestnet();
}

module.exports = client;