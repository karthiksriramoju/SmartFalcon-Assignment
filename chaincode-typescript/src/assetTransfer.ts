import { Context, Contract } from 'fabric-contract-api';

export class Asset {
    dealerId: string = '';
    msisdn: string = '';
    mpin: string = '';
    balance: number = 0;
    status: string = '';
    transAmount: number = 0;
    transType: string = '';
    remarks: string = '';
}

export class AssetContract extends Contract {

    // Create 
    async CreateAsset(ctx: Context, assetId: string, dealerId: string, msisdn: string, mpin: string, balance: number, status: string, transAmount: number, transType: string, remarks: string): Promise<void> {
        const asset: Asset = {
            dealerId,
            msisdn,
            mpin,
            balance: Number(balance),
            status,
            transAmount: Number(transAmount),
            transType,
            remarks
        };
        const assetExists = await this.AssetExists(ctx, assetId);
        if (assetExists) {
            throw new Error(`Asset ${assetId} already exists`);
        }
        await ctx.stub.putState(assetId, Buffer.from(JSON.stringify(asset)));
    }

    // Read 
    async ReadAsset(ctx: Context, assetId: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(assetId);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`Asset ${assetId} does not exist`);
        }
        return assetJSON.toString();
    }

    // Update 
    async UpdateAsset(ctx: Context, assetId: string, balance: number, status: string, transAmount: number, transType: string, remarks: string): Promise<void> {
        const assetJSON = await ctx.stub.getState(assetId);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`Asset ${assetId} does not exist`);
        }
        const asset: Asset = JSON.parse(assetJSON.toString());
        asset.balance = Number(balance);
        asset.status = status;
        asset.transAmount = Number(transAmount);
        asset.transType = transType;
        asset.remarks = remarks;
        await ctx.stub.putState(assetId, Buffer.from(JSON.stringify(asset)));
    }

    // Get History
    async GetAssetHistory(ctx: Context, assetId: string): Promise<string[]> {
        const history = [];
        const iterator = await ctx.stub.getHistoryForKey(assetId);
        let result = await iterator.next();
        while (!result.done) {
            if (result.value && result.value.value.toString()) {
                history.push(result.value.value.toString());
            }
            result = await iterator.next();
        }
        await iterator.close();
        return history;
    }

    // checks if assest exists
    async AssetExists(ctx: Context, assetId: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(assetId);
        return assetJSON && assetJSON.length > 0;
    }
}
