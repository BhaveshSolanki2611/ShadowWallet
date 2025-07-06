import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, sepolia, polygonMumbai, optimismSepolia, arbitrumSepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const config = getDefaultConfig({
  appName: import.meta.env.VITE_APP_NAME || 'ShadowWallet',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfb',
  chains: import.meta.env.VITE_ENABLE_TESTNETS === 'true' 
    ? [mainnet, polygon, optimism, arbitrum, sepolia, polygonMumbai, optimismSepolia, arbitrumSepolia]
    : [mainnet, polygon, optimism, arbitrum],
  ssr: false,
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
