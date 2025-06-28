import { Wallets } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const walletPath = process.env.WALLET_PATH || path.join(__dirname, '../../dist/wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const identityLabel = process.env.USER_ID || 'Admin';
  const mspId = process.env.MSP_ID || 'Org1MSP';

  const certPath = path.join(__dirname, '../../fabric/crypto/org1/admin/msp/signcerts/cert.pem');
  const keyDir = path.join(__dirname, '../../fabric/crypto/org1/admin/msp/keystore');

  if (!fs.existsSync(certPath)) {
    throw new Error(`cert.pem not found at: ${certPath}`);
  }

  if (!fs.existsSync(keyDir)) {
    throw new Error(`Keystore directory not found at: ${keyDir}`);
  }

  const keyFiles = fs.readdirSync(keyDir);
  if (!keyFiles.length) {
    throw new Error(`No key files found in: ${keyDir}`);
  }

  const keyPath = path.join(keyDir, keyFiles[0]);
  const cert = fs.readFileSync(certPath, 'utf8');
  const key = fs.readFileSync(keyPath, 'utf8');

  const identity = {
    credentials: {
      certificate: cert,
      privateKey: key,
    },
    mspId,
    type: 'X.509',
  };

  await wallet.put(identityLabel, identity);
  console.log(`✅ Identity '${identityLabel}' imported successfully`);
}

main().catch((e) => {
  console.error(`❌ Error importing identity: ${e}`);
  process.exit(1);
});
