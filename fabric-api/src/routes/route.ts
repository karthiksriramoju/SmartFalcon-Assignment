import express from 'express';
import { getContract } from '../fabric';

const router = express.Router();

router.post('/api/assets/create', async (req, res) => {
  try {
    const {
      assetId,
      dealerId,
      msisdn,
      mpin,
      balance,
      status,
      transAmount,
      transType,
      remarks
    } = req.body;

    const contract = await getContract();
    await contract.submitTransaction(
      'CreateAsset',
      assetId,
      dealerId,
      msisdn,
      mpin,
      balance.toString(),
      status,
      transAmount.toString(),
      transType,
      remarks
    );

    res.json({ message: `Asset ${assetId} created successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/assets/:id', async (req, res) => {
  try {
    const contract = await getContract();
    const result = await contract.evaluateTransaction('ReadAsset', req.params.id);
    res.json(JSON.parse(result.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/api/assets/:id', async (req, res) => {
  try {
    const {
      balance,
      status,
      transAmount,
      transType,
      remarks
    } = req.body;

    const contract = await getContract();
    await contract.submitTransaction(
      'UpdateAsset',
      req.params.id,
      balance.toString(),
      status,
      transAmount.toString(),
      transType,
      remarks
    );

    res.json({ message: `Asset ${req.params.id} updated successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/assets/:id/history', async (req, res) => {
  try {
    const contract = await getContract();
    const result = await contract.evaluateTransaction('GetAssetHistory', req.params.id);
    res.json(JSON.parse(result.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
