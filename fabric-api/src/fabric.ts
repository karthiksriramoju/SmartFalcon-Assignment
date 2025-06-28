import path from 'path';
import fs from 'fs';
import { Wallets, Gateway } from 'fabric-network';
import dotenv from 'dotenv';

dotenv.config();

export async function getContract() {
    const ccpPath = path.resolve(__dirname, process.env.CONNECTION_PROFILE!);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.resolve(__dirname, '..', process.env.WALLET_PATH!);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get(process.env.USER_ID!);
    if (!identity) {
        throw new Error(`Identity for user ${process.env.USER_ID} not found in wallet`);
    }
    const userId = process.env.USER_ID;
    if (!userId) {
      throw new Error("USER_ID is not set in environment variables");
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: process.env.USER_ID!,
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork(process.env.CHANNEL_NAME!);
    const contract = network.getContract(process.env.CHAINCODE_NAME!);
    return contract;
}
