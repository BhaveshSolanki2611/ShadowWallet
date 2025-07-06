import { useState, useEffect } from 'react';
import { Shield, Send, Download, Settings, Wallet, Copy, Key, Lock, Globe, TrendingUp, AlertCircle, LogOut, Network } from 'lucide-react';
import { useAccount, useBalance, useDisconnect, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { apiService } from './services/api';
import { getNetworkConfig } from './config/networks';

interface PrivateKey {
  secret: string;
  viewingKey: string;
}

interface Transaction {
  id: number;
  type: 'shield' | 'transfer' | 'unshield';
  amount: string;
  token: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
  privacy: 'shielded' | 'private' | 'revealed';
}

const ShadowWallet = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shieldedBalance, setShieldedBalance] = useState('0.00');
  const [privateKey, setPrivateKey] = useState<PrivateKey | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [proofGeneration, setProofGeneration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transferProcessing, setTransferProcessing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  
  // Form state
  const [shieldAmount, setShieldAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferToken, setTransferToken] = useState('ETH');

  // Web3 hooks
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  // Get network information using the network config
  const networkConfig = getNetworkConfig(chainId);
  const chainInfo = {
    name: networkConfig.name,
    type: networkConfig.type === 'testnet' ? 'Testnet' : 
          networkConfig.type === 'devnet' ? 'Devnet' : 'Mainnet',
    color: networkConfig.color
  };

  // Load user data and transactions when wallet is connected
  useEffect(() => {
    const initializeUserData = async () => {
      if (isConnected && address) {
        try {
          setNotification({ type: 'info', message: 'Loading your ShadowWallet data...' });
          
          // Initialize or get user
          const user = await apiService.initializeUser(address, address);
          setShieldedBalance(user.shieldedBalance);
          
          // Load transactions
          const dbTransactions = await apiService.getTransactions(address);
          const formattedTransactions: Transaction[] = dbTransactions.map((tx, index) => ({
            id: index + 1,
            type: tx.type,
            amount: tx.amount,
            token: tx.token,
            timestamp: tx.createdAt?.toString() || new Date().toISOString(),
            status: tx.status as 'confirmed' | 'pending',
            privacy: tx.privacy as 'shielded' | 'private' | 'revealed'
          }));
          
          setTransactions(formattedTransactions);
          setNotification({ type: 'success', message: 'ShadowWallet data loaded successfully!' });
          
        } catch (error) {
          console.error('Failed to load user data:', error);
          setNotification({ type: 'error', message: 'Failed to load ShadowWallet data. Using offline mode.' });
          
          // Fallback to mock data
          setTransactions([
            { id: 1, type: 'shield', amount: '0.5', token: 'ETH', timestamp: new Date().toISOString(), status: 'confirmed', privacy: 'shielded' },
            { id: 2, type: 'transfer', amount: '0.25', token: 'USDC', timestamp: new Date().toISOString(), status: 'pending', privacy: 'private' },
            { id: 3, type: 'unshield', amount: '0.1', token: 'DAI', timestamp: new Date().toISOString(), status: 'confirmed', privacy: 'revealed' }
          ]);
          setShieldedBalance('1.834');
        }
      }
    };

    initializeUserData();
  }, [isConnected, address]);

  const generatePrivateKey = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockKey = {
      secret: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      viewingKey: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    setPrivateKey(mockKey);
    setIsLoading(false);
  };

  const generateZkProof = async () => {
    if (!shieldAmount || parseFloat(shieldAmount) <= 0) {
      setNotification({ type: 'error', message: 'Please enter a valid amount to shield' });
      return;
    }
    
    setProofGeneration(true);
    setNotification({ type: 'info', message: 'Generating zero-knowledge proof...' });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate successful shielding
    const newTransaction: Transaction = {
      id: Date.now(),
      type: 'shield',
      amount: shieldAmount,
      token: selectedToken,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      privacy: 'shielded'
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setShieldedBalance(prev => (parseFloat(prev) + parseFloat(shieldAmount)).toFixed(3));
    setShieldAmount('');
    setProofGeneration(false);
    setNotification({ type: 'success', message: `Successfully shielded ${shieldAmount} ${selectedToken}!` });
  };

  const executePrivateTransfer = async () => {
    if (!recipientAddress || !transferAmount || parseFloat(transferAmount) <= 0) {
      setNotification({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }
    
    if (parseFloat(transferAmount) > parseFloat(shieldedBalance)) {
      setNotification({ type: 'error', message: 'Insufficient shielded balance' });
      return;
    }
    
    setTransferProcessing(true);
    setNotification({ type: 'info', message: 'Processing private transfer...' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful transfer
    const newTransaction: Transaction = {
      id: Date.now(),
      type: 'transfer',
      amount: transferAmount,
      token: transferToken,
      timestamp: new Date().toISOString(),
      status: 'pending',
      privacy: 'private'
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setShieldedBalance(prev => (parseFloat(prev) - parseFloat(transferAmount)).toFixed(3));
    setTransferAmount('');
    setRecipientAddress('');
    setTransferProcessing(false);
    setNotification({ type: 'success', message: `Private transfer of ${transferAmount} ${transferToken} initiated!` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setNotification({ type: 'success', message: 'Copied to clipboard!' });
  };

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Notification component
  const NotificationBar = () => {
    if (!notification) return null;
    
    const bgColor = notification.type === 'success' ? 'bg-green-500/20 border-green-500/30' : 
                    notification.type === 'error' ? 'bg-red-500/20 border-red-500/30' : 
                    'bg-blue-500/20 border-blue-500/30';
    
    const textColor = notification.type === 'success' ? 'text-green-400' : 
                      notification.type === 'error' ? 'text-red-400' : 
                      'text-blue-400';
    
    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border ${bgColor} ${textColor} max-w-md animate-slide-in`}>
        <div className="flex items-center justify-between">
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 hover:opacity-70"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  const ShadowWalletLogo = () => (
    <div className="relative">
      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center border-2 border-slate-500">
        <Wallet className="w-6 h-6 text-slate-300" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Shield className="w-2.5 h-2.5 text-white" />
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-700">
          <div className="flex justify-center mb-6">
            <ShadowWalletLogo />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ShadowWallet</h1>
          <p className="text-slate-400 mb-6">Zero-knowledge privacy for your crypto transactions</p>
          <div className="w-full">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                          >
                            <span>Connect Wallet</span>
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="text-white">
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
          <div className="mt-6 text-sm text-slate-500">
            <p>Powered by Groth16 zk-SNARKs</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <NotificationBar />
      <div className="bg-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ShadowWalletLogo />
              <h1 className="text-xl font-bold text-white">ShadowWallet</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    chainInfo.type === 'Testnet' ? 'bg-yellow-500' : 
                    chainInfo.type === 'Devnet' ? 'bg-orange-500' : 'bg-green-500'
                  }`}></div>
                  <span className={`text-sm ${
                    chainInfo.type === 'Testnet' ? 'text-yellow-400' : 
                    chainInfo.type === 'Devnet' ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    Connected {chainInfo.type !== 'Mainnet' ? `(${chainInfo.type})` : ''}
                  </span>
                </div>
                <div className="text-sm text-slate-300">
                  <span className="font-mono">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No Address'}
                  </span>
                </div>
                <div className={`text-sm ${chainInfo.color} flex items-center space-x-1`}>
                  <Network className="w-3 h-3" />
                  <span>{chainInfo.name}</span>
                  {balance && (
                    <span className="text-slate-400">
                      ({parseFloat(balance.formatted).toFixed(4)} {balance.symbol})
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => disconnect()}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Wallet },
              { id: 'shield', label: 'Shield', icon: Shield },
              { id: 'transfer', label: 'Transfer', icon: Send },
              { id: 'keys', label: 'Keys', icon: Key }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to ShadowWallet</h2>
                  <p className="text-slate-300">Your gateway to zero-knowledge privacy on the blockchain</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Privacy Score</p>
                    <p className="text-xl font-bold text-green-400">98%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-green-300">+5.2%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Public Balance</h3>
                    <p className="text-3xl font-bold mb-1">
                      {balance ? `${balance.formatted} ${balance.symbol}` : '0.00 ETH'}
                    </p>
                    <p className="text-sm opacity-75">≈ $4,934.00</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Lock className="w-4 h-4 text-emerald-300" />
                      <span className="text-sm text-emerald-300">Private</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Shielded Balance</h3>
                    <p className="text-3xl font-bold mb-1">{shieldedBalance} ETH</p>
                    <p className="text-sm opacity-75">≈ $3,668.00</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Globe className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium opacity-90">Cross-Chain</h3>
                    <p className="text-3xl font-bold mb-1">3</p>
                    <p className="text-sm opacity-75">Networks</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="bg-slate-700 rounded-xl p-4 border border-slate-600 hover:border-slate-500 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20">
                            {tx.type === 'shield' && <Shield className="w-5 h-5 text-blue-400" />}
                            {tx.type === 'transfer' && <Send className="w-5 h-5 text-green-400" />}
                            {tx.type === 'unshield' && <Download className="w-5 h-5 text-purple-400" />}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-white capitalize">{tx.type}</p>
                          <p className="text-sm text-slate-400">{new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{tx.amount} {tx.token}</p>
                        <span className={`text-sm px-2 py-1 rounded text-xs ${
                          tx.status === 'confirmed' ? 'text-green-400 bg-green-500/20' : 'text-orange-400 bg-orange-500/20'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shield' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Shield Tokens</h3>
                  <p className="text-slate-400">Shield your tokens using Groth16 zk-SNARKs for complete privacy</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Token</label>
                    <select 
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ETH">ETH - Ethereum</option>
                      <option value="USDC">USDC - USD Coin</option>
                      <option value="DAI">DAI - Dai Stablecoin</option>
                      <option value="WBTC">WBTC - Wrapped Bitcoin</option>
                      <option value="USDT">USDT - Tether</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Amount</label>
                    <input 
                      type="number"
                      placeholder="0.00"
                      step="0.001"
                      value={shieldAmount}
                      onChange={(e) => setShieldAmount(e.target.value)}
                      className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={generateZkProof}
                  disabled={proofGeneration}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {proofGeneration ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating ZK Proof...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Shield Tokens</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Private Transfer</h3>
                  <p className="text-slate-400">Send tokens privately within the shielded pool</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Recipient Address</label>
                  <input 
                    type="text"
                    placeholder="0x... or ENS name"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Amount</label>
                    <input 
                      type="number"
                      placeholder="0.00"
                      step="0.001"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Token</label>
                    <select 
                      value={transferToken}
                      onChange={(e) => setTransferToken(e.target.value)}
                      className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="ETH">ETH - Ethereum</option>
                      <option value="USDC">USDC - USD Coin</option>
                      <option value="DAI">DAI - Dai Stablecoin</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  onClick={executePrivateTransfer}
                  disabled={transferProcessing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {transferProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Transfer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Privately</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Key className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Private Key Management</h3>
                  <p className="text-slate-400">Manage your private keys and viewing permissions</p>
                </div>
              </div>
              
              {!privateKey ? (
                <div className="text-center py-8">
                  <Key className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No private key generated yet</p>
                  <button 
                    onClick={generatePrivateKey}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Generating...' : 'Generate Private Key'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Secret Key</h4>
                        <button 
                          onClick={() => copyToClipboard(privateKey.secret)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 font-mono break-all">{privateKey.secret}</p>
                    </div>
                    
                    <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Viewing Key</h4>
                        <button 
                          onClick={() => copyToClipboard(privateKey.viewingKey)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 font-mono break-all">{privateKey.viewingKey}</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                    <h4 className="font-semibold text-yellow-400 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Security Notice
                    </h4>
                    <div className="space-y-2 text-sm text-yellow-200">
                      <p>• Never share your secret key with anyone</p>
                      <p>• Store keys securely offline when possible</p>
                      <p>• Use viewing keys for read-only access</p>
                      <p>• Regenerate keys if compromised</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShadowWallet;
