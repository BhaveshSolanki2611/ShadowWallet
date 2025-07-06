import { VercelRequest, VercelResponse } from '@vercel/node';
import connectToDatabase from '../src/lib/mongodb';
import User from '../src/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectToDatabase();

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
          const { walletAddress } = req.query;
          
          if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
          }

          const user = await User.findOne({ walletAddress });
          
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          return res.status(200).json(user);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to fetch user' });
        }

      case 'POST':
        try {
          const { walletAddress, publicKey, privateKey } = req.body;

          if (!walletAddress || !publicKey) {
            return res.status(400).json({ error: 'Wallet address and public key are required' });
          }

          // Check if user already exists
          const existingUser = await User.findOne({ walletAddress });
          if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
          }

          const user = new User({
            walletAddress,
            publicKey,
            privateKey
          });

          await user.save();
          return res.status(201).json(user);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

      case 'PUT':
        try {
          const { walletAddress } = req.query;
          const updates = req.body;

          if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
          }

          const user = await User.findOneAndUpdate(
            { walletAddress },
            updates,
            { new: true }
          );

          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          return res.status(200).json(user);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to update user' });
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
