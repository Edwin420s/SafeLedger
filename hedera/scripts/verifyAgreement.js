// scripts/verifyAgreement.js
// Interact with deployed AgreementVerification contract to store/verify hashes
const { Client, ContractCallQuery, ContractExecuteTransaction, ContractId, Hbar } = require('@hashgraph/sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Replace with your deployed contract ID
const CONTRACT_ID = process.env.CONTRACT_ID || "0.0.12345"; // update after deployment

async function storeHash(hashHex) {
    const client = Client.forTestnet();
    client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

    const contractId = ContractId.fromString(CONTRACT_ID);

    // Convert hex string to bytes32
    const bytes32 = Buffer.from(hashHex, 'hex');

    const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("storeHash", [bytes32]);

    const response = await tx.execute(client);
    const receipt = await response.getReceipt(client);
    console.log(`Hash stored. Transaction status: ${receipt.status.toString()}`);
    console.log(`Transaction ID: ${response.transactionId}`);
}

async function verifyHash(hashHex) {
    const client = Client.forTestnet();
    // No operator needed for query (but you may need to set operator for testnet)
    client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

    const contractId = ContractId.fromString(CONTRACT_ID);
    const bytes32 = Buffer.from(hashHex, 'hex');

    const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("verifyHash", [bytes32]);

    const result = await query.execute(client);
    const exists = result.getBool(0);
    const timestamp = result.getUint256(1);
    console.log(`Hash exists: ${exists}`);
    if (exists) {
        console.log(`Timestamp: ${new Date(timestamp * 1000).toISOString()}`);
    }
    return { exists, timestamp };
}

// Example usage (if run directly)
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    const hash = args[1];
    if (command === 'store' && hash) {
        storeHash(hash).catch(console.error);
    } else if (command === 'verify' && hash) {
        verifyHash(hash).catch(console.error);
    } else {
        console.log('Usage: node verifyAgreement.js <store|verify> <hexHash>');
    }
}

module.exports = { storeHash, verifyHash };