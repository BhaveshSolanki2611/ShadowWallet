const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

export interface User {
  _id?: string;
  walletAddress: string;
  publicKey: string;
  privateKey?: {
    secret: string;
    viewingKey: string;
  };
  shieldedBalance: string;
  preferences: {
    enableTestnets: boolean;
    defaultToken: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Transaction {
  _id?: string;
  walletAddress: string;
  txHash?: string;
  type: 'shield' | 'transfer' | 'unshield';
  amount: string;
  token: string;
  recipientAddress?: string;
  status: 'pending' | 'confirmed' | 'failed';
  privacy: 'shielded' | 'private' | 'revealed';
  zkProof?: string;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User API methods
  async getUser(walletAddress: string): Promise<User> {
    return this.request<User>(`/users?walletAddress=${walletAddress}`);
  }

  async createUser(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(walletAddress: string, updates: Partial<User>): Promise<User> {
    return this.request<User>(`/users?walletAddress=${walletAddress}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Transaction API methods
  async getTransactions(walletAddress: string, limit = 10, offset = 0): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions?walletAddress=${walletAddress}&limit=${limit}&offset=${offset}`);
  }

  async createTransaction(transaction: Omit<Transaction, '_id' | 'txHash' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>(`/transactions?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Utility methods
  async initializeUser(walletAddress: string, publicKey: string): Promise<User> {
    try {
      // Try to get existing user
      const existingUser = await this.getUser(walletAddress);
      return existingUser;
    } catch (error) {
      // User doesn't exist, create new one
      const newUser: Omit<User, '_id' | 'createdAt' | 'updatedAt'> = {
        walletAddress,
        publicKey,
        shieldedBalance: '0.000',
        preferences: {
          enableTestnets: true,
          defaultToken: 'ETH'
        }
      };
      
      return this.createUser(newUser);
    }
  }

  async shieldTokens(
    walletAddress: string,
    amount: string,
    token: string,
    zkProof: string
  ): Promise<{ transaction: Transaction; user: User }> {
    // Create shield transaction
    const transaction = await this.createTransaction({
      walletAddress,
      type: 'shield',
      amount,
      token,
      privacy: 'shielded',
      zkProof,
      status: 'pending'
    });

    // Update user's shielded balance
    const user = await this.getUser(walletAddress);
    const newBalance = (parseFloat(user.shieldedBalance) + parseFloat(amount)).toFixed(3);
    const updatedUser = await this.updateUser(walletAddress, {
      shieldedBalance: newBalance
    });

    // Mark transaction as confirmed
    await this.updateTransaction(transaction._id!, { status: 'confirmed' });

    return { transaction, user: updatedUser };
  }

  async transferTokens(
    walletAddress: string,
    recipientAddress: string,
    amount: string,
    token: string,
    zkProof: string
  ): Promise<{ transaction: Transaction; user: User }> {
    // Create transfer transaction
    const transaction = await this.createTransaction({
      walletAddress,
      type: 'transfer',
      amount,
      token,
      recipientAddress,
      privacy: 'private',
      zkProof,
      status: 'pending'
    });

    // Update user's shielded balance
    const user = await this.getUser(walletAddress);
    const newBalance = (parseFloat(user.shieldedBalance) - parseFloat(amount)).toFixed(3);
    const updatedUser = await this.updateUser(walletAddress, {
      shieldedBalance: newBalance
    });

    // Mark transaction as confirmed after a delay (simulated)
    setTimeout(async () => {
      await this.updateTransaction(transaction._id!, { status: 'confirmed' });
    }, 2000);

    return { transaction, user: updatedUser };
  }
}

export const apiService = new ApiService();
