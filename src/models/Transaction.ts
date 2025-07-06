import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  txHash: {
    type: String,
    unique: true,
    sparse: true
  },
  type: {
    type: String,
    required: true,
    enum: ['shield', 'transfer', 'unshield']
  },
  amount: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  recipientAddress: {
    type: String,
    required: function(this: any) {
      return this.type === 'transfer';
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  privacy: {
    type: String,
    required: true,
    enum: ['shielded', 'private', 'revealed']
  },
  zkProof: {
    type: String,
    required: function(this: any) {
      return this.privacy === 'shielded' || this.privacy === 'private';
    }
  },
  gasUsed: {
    type: String,
    default: '0'
  },
  gasPrice: {
    type: String,
    default: '0'
  },
  blockNumber: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TransactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

TransactionSchema.index({ walletAddress: 1, createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
