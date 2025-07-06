import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    secret: String,
    viewingKey: String
  },
  shieldedBalance: {
    type: String,
    default: '0.000'
  },
  preferences: {
    enableTestnets: {
      type: Boolean,
      default: true
    },
    defaultToken: {
      type: String,
      default: 'ETH'
    }
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

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
