import { VercelRequest, VercelResponse } from '@vercel/node';
import connectToDatabase from '../src/lib/mongodb';
import Transaction from '../src/models/Transaction';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectToDatabase();

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
          const { walletAddress, limit = 10, offset = 0 } = req.query;
          
          if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
          }

          const transactions = await Transaction.find({ walletAddress })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(offset));

          return res.status(200).json(transactions);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to fetch transactions' });
        }

      case 'POST':
        try {
          const {
            walletAddress,
            type,
            amount,
            token,
            recipientAddress,
            privacy,
            zkProof
          } = req.body;

          if (!walletAddress || !type || !amount || !token || !privacy) {
            return res.status(400).json({ 
              error: 'Required fields: walletAddress, type, amount, token, privacy' 
            });
          }

          // Generate a mock transaction hash
          const txHash = '0x' + Math.random().toString(16).substr(2, 64);
          
          const transaction = new Transaction({
            walletAddress,
            txHash,
            type,
            amount,
            token,
            recipientAddress,
            privacy,
            zkProof: zkProof || `zkp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending'
          });

          await transaction.save();
          return res.status(201).json(transaction);
        } catch (error) {
          console.error('Transaction creation error:', error);
          return res.status(500).json({ error: 'Failed to create transaction' });
        }

      case 'PUT':
        try {
          const { id } = req.query;
          const updates = req.body;

          if (!id) {
            return res.status(400).json({ error: 'Transaction ID is required' });
          }

          const transaction = await Transaction.findByIdAndUpdate(
            id,
            updates,
            { new: true }
          );

          if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
          }

          return res.status(200).json(transaction);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to update transaction' });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
}
