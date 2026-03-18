const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function compileContract() {
  const contractPath = path.join(__dirname, '../contracts/AgreementVerification.sol');
  const outputPath = path.join(__dirname, '../contracts/AgreementVerification.bin');
  
  console.log('Compiling AgreementVerification.sol...');
  
  return new Promise((resolve, reject) => {
    exec(`solc --bin ${contractPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Compilation error:', error);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error('Solc warning:', stderr);
      }
      
      const lines = stdout.split('\n');
      let bytecode = '';
      let inBinary = false;
      
      for (const line of lines) {
        if (line.includes('Binary:')) {
          inBinary = true;
          continue;
        }
        if (inBinary && line.trim()) {
          bytecode += line.trim();
        }
        if (inBinary && line.includes('')) {
          break;
        }
      }
      
      if (!bytecode) {
        const binaryIndex = stdout.indexOf('Binary:');
        if (binaryIndex !== -1) {
          const afterBinary = stdout.substring(binaryIndex + 7);
          bytecode = afterBinary.split('\n')[0].trim();
        }
      }
      
      if (!bytecode) {
        reject(new Error('No bytecode found in compilation output'));
        return;
      }
      
      fs.writeFileSync(outputPath, bytecode);
      console.log(`✅ Contract compiled successfully! Bytecode saved to ${outputPath}`);
      console.log(`Bytecode length: ${bytecode.length} characters`);
      resolve(bytecode);
    });
  });
}

if (require.main === module) {
  compileContract().catch(console.error);
}

module.exports = { compileContract };
