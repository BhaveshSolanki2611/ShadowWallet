export interface NetworkConfig {
  id: number;
  name: string;
  type: 'mainnet' | 'testnet' | 'devnet';
  color: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet?: boolean;
  isDevnet?: boolean;
}

export const NETWORK_CONFIGS: Record<number, NetworkConfig> = {
  // Mainnet Networks
  1: {
    id: 1,
    name: 'Ethereum',
    type: 'mainnet',
    color: 'text-blue-400',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  137: {
    id: 137,
    name: 'Polygon',
    type: 'mainnet',
    color: 'text-purple-400',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  10: {
    id: 10,
    name: 'Optimism',
    type: 'mainnet',
    color: 'text-red-400',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  42161: {
    id: 42161,
    name: 'Arbitrum',
    type: 'mainnet',
    color: 'text-blue-400',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  
  // Testnet Networks
  11155111: {
    id: 11155111,
    name: 'Sepolia',
    type: 'testnet',
    color: 'text-yellow-400',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
    isTestnet: true
  },
  80001: {
    id: 80001,
    name: 'Mumbai',
    type: 'testnet',
    color: 'text-yellow-400',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    isTestnet: true
  },
  11155420: {
    id: 11155420,
    name: 'Optimism Sepolia',
    type: 'testnet',
    color: 'text-yellow-400',
    rpcUrl: 'https://sepolia.optimism.io',
    blockExplorer: 'https://sepolia-optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isTestnet: true
  },
  421614: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    type: 'testnet',
    color: 'text-yellow-400',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: 'https://sepolia.arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isTestnet: true
  },
  
  // Local Development Networks
  31337: {
    id: 31337,
    name: 'Hardhat',
    type: 'devnet',
    color: 'text-green-400',
    rpcUrl: 'http://localhost:8545',
    blockExplorer: 'http://localhost:8545',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isDevnet: true
  },
  1337: {
    id: 1337,
    name: 'Ganache',
    type: 'devnet',
    color: 'text-green-400',
    rpcUrl: 'http://localhost:7545',
    blockExplorer: 'http://localhost:7545',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isDevnet: true
  }
};

export function getNetworkConfig(chainId: number): NetworkConfig {
  return NETWORK_CONFIGS[chainId] || {
    id: chainId,
    name: 'Unknown',
    type: 'mainnet',
    color: 'text-gray-400',
    rpcUrl: '',
    blockExplorer: '',
    nativeCurrency: { name: 'Unknown', symbol: 'UNK', decimals: 18 }
  };
}

export function isTestnet(chainId: number): boolean {
  const config = getNetworkConfig(chainId);
  return config.type === 'testnet' || config.isTestnet === true;
}

export function isDevnet(chainId: number): boolean {
  const config = getNetworkConfig(chainId);
  return config.type === 'devnet' || config.isDevnet === true;
}

export function getNetworkType(chainId: number): 'mainnet' | 'testnet' | 'devnet' {
  const config = getNetworkConfig(chainId);
  return config.type;
}

export function getNetworksByType(type: 'mainnet' | 'testnet' | 'devnet'): NetworkConfig[] {
  return Object.values(NETWORK_CONFIGS).filter(config => config.type === type);
}

export function getAllNetworks(): NetworkConfig[] {
  return Object.values(NETWORK_CONFIGS);
}

export function getSupportedChainIds(): number[] {
  return Object.keys(NETWORK_CONFIGS).map(Number);
}
