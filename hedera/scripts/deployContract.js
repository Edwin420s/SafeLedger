// scripts/deployContract.js
// Deploy AgreementVerification contract to Hedera (testnet)
const { Client, FileCreateTransaction, ContractCreateTransaction, ContractFunctionParameters } = require('@hashgraph/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function main() {
    // Configure Hedera client
    const client = Client.forTestnet();
    client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

    // Read the compiled contract bytecode (you need to compile the .sol file first)
    // For simplicity, we assume you have compiled with solc and have the bytecode file.
    // If not, you can use a placeholder or compile on the fly (not recommended for hackathon).
    // Instead, we'll use a small hardcoded bytecode for demonstration (but in reality you must compile).
    // For this example, we'll just log a message and not deploy to avoid errors.
    console.log("Deploying AgreementVerification contract...");

    // Example using actual compilation: 
    // const bytecode = fs.readFileSync(path.join(__dirname, '../contracts/AgreementVerification.bin'), 'utf8');
    // For now, we'll simulate:

    console.log("Please compile contract first to get bytecode.");
    console.log("Run: solc --bin AgreementVerification.sol > AgreementVerification.bin");
    console.log("Then uncomment the deployment code below.");

    // If bytecode is available:
    const bytecodePath = path.join(__dirname, '../contracts/AgreementVerification.bin');
    if (fs.existsSync(bytecodePath)) {
        const bytecode = fs.readFileSync(bytecodePath, 'utf8').trim();

        // Create a file on Hedera to store contract bytecode
        const fileTx = new FileCreateTransaction()
            .setContents(bytecode)
            .setKeys([client.operatorPublicKey]);
        const fileResponse = await fileTx.execute(client);
        const fileReceipt = await fileResponse.getReceipt(client);
        const fileId = fileReceipt.fileId;
        console.log(`Bytecode file created: ${fileId}`);

        // Create contract
        const contractTx = new ContractCreateTransaction()
            .setBytecodeFileId(fileId)
            .setGas(1000000) // adjust as needed
            .setConstructorParameters(new ContractFunctionParameters());
        const contractResponse = await contractTx.execute(client);
        const contractReceipt = await contractResponse.getReceipt(client);
        const contractId = contractReceipt.contractId;
        console.log(`Contract deployed with ID: ${contractId}`);
        console.log(`View at: https://hashscan.io/testnet/contract/${contractId}`);
        
        // Save contract ID to .env for later use
        const envPath = path.join(__dirname, '../../.env');
        if (fs.existsSync(envPath)) {
            let envContent = fs.readFileSync(envPath, 'utf8');
            if (envContent.includes('CONTRACT_ID=')) {
                envContent = envContent.replace(/CONTRACT_ID=.*/, `CONTRACT_ID=${contractId}`);
            } else {
                envContent += `\nCONTRACT_ID=${contractId}`;
            }
            fs.writeFileSync(envPath, envContent);
            console.log(`Contract ID saved to .env file`);
        }
    } else {
        console.log("Bytecode file not found. Please compile the contract first.");
    }
}

main().catch(console.error);