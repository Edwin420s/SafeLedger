const { Client, FileCreateTransaction, ContractCreateTransaction, ContractFunctionParameters } = require('@hashgraph/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function main() {
    const client = Client.forTestnet();
    client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

    console.log("Deploying AgreementVerification contract...");

    const bytecodePath = path.join(__dirname, '../contracts/AgreementVerification.bin');
    if (fs.existsSync(bytecodePath)) {
        const bytecode = fs.readFileSync(bytecodePath, 'utf8').trim();

        const fileTx = new FileCreateTransaction()
            .setContents(bytecode)
            .setKeys([client.operatorPublicKey]);
        const fileResponse = await fileTx.execute(client);
        const fileReceipt = await fileResponse.getReceipt(client);
        const fileId = fileReceipt.fileId;
        console.log(`Bytecode file created: ${fileId}`);

        const contractTx = new ContractCreateTransaction()
            .setBytecodeFileId(fileId)
            .setGas(1000000)
            .setConstructorParameters(new ContractFunctionParameters());
        const contractResponse = await contractTx.execute(client);
        const contractReceipt = await contractResponse.getReceipt(client);
        const contractId = contractReceipt.contractId;
        console.log(`Contract deployed with ID: ${contractId}`);
        console.log(`View at: https://hashscan.io/testnet/contract/${contractId}`);
        
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
        console.log("Run: solc --bin AgreementVerification.sol > AgreementVerification.bin");
    }
}

main().catch(console.error);