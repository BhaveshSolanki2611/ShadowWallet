# ShadowWallet - Zero-Knowledge Privacy Wallet

ShadowWallet is a decentralized privacy wallet that uses zero-knowledge proofs (Groth16 zk-SNARKs) to provide complete transaction privacy on the blockchain.

## Features

- 🔒 **Zero-Knowledge Privacy**: Shield your transactions using advanced cryptographic proofs
- 🌐 **Multi-Chain Support**: Works with Ethereum, Polygon, Optimism, and Arbitrum
- 💼 **Wallet Integration**: Connect with MetaMask, WalletConnect, Coinbase Wallet, and more
- 🛡️ **Private Transfers**: Send tokens privately within the shielded pool
- 📊 **Real-time Dashboard**: Monitor your public and private balances
- 🔑 **Key Management**: Secure private key and viewing key generation
- 🧪 **Testnet Support**: Full support for testing on testnets

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Ethers.js
- **Deployment**: Vercel
- **Privacy**: Groth16 zk-SNARKs (simulated)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- WalletConnect Project ID

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd railgan-privacy-wallet
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Required: WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: App Configuration
VITE_APP_NAME=ShadowWallet
VITE_APP_DESCRIPTION=Zero-knowledge privacy for your crypto transactions
VITE_ENABLE_TESTNETS=true

# Optional: Analytics
VITE_ANALYTICS_ID=

# Environment
NODE_ENV=development
```

### 4. Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID
5. Add it to your `.env.local` file

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Production Deployment to Vercel

### Method 1: Deploy via Vercel CLI

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
vercel --prod
```

### Method 2: Deploy via Vercel Dashboard

#### 1. Push to Git Repository

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings (auto-detected)

#### 3. Configure Environment Variables

In your Vercel project settings, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_WALLETCONNECT_PROJECT_ID` | `your_project_id` | **Required** - Get from WalletConnect Cloud |
| `VITE_APP_NAME` | `ShadowWallet` | App name |
| `VITE_APP_DESCRIPTION` | `Zero-knowledge privacy for your crypto transactions` | App description |
| `VITE_ENABLE_TESTNETS` | `true` | Enable testnet support |
| `NODE_ENV` | `production` | Environment |

#### 4. Deploy

Click "Deploy" and wait for the build to complete.

### Method 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/railgan-privacy-wallet&env=VITE_WALLETCONNECT_PROJECT_ID&envDescription=WalletConnect%20Project%20ID%20required%20for%20wallet%20connections&envLink=https://cloud.walletconnect.com)

## Environment Variables Reference

### Required Variables

- `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect Project ID for wallet connections

### Optional Variables

- `VITE_APP_NAME`: Application name (default: "ShadowWallet")
- `VITE_APP_DESCRIPTION`: App description for metadata
- `VITE_ENABLE_TESTNETS`: Enable testnet support (default: "true")
- `VITE_ANALYTICS_ID`: Analytics tracking ID
- `NODE_ENV`: Environment mode

## Build Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Production build with optimization
npm run build:prod

# Type checking
npm run type-check

# Linting
npm run lint

# Preview production build
npm run preview

# Bundle analysis
npm run analyze
```

## Vercel Configuration

The project includes a `vercel.json` configuration file with:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Redirects**: SPA routing support
- **Security Headers**: XSS protection, content type sniffing prevention
- **Environment Variables**: Auto-injected from Vercel settings

## Domain Configuration

### Custom Domain Setup

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed
5. SSL certificates are automatically provisioned

### Domain Examples

- Production: `https://shadowwallet.vercel.app`
- Custom: `https://your-domain.com`

## Performance Optimization

The build includes several optimizations:

- **Code Splitting**: Vendor, wagmi, and tanstack chunks
- **Tree Shaking**: Unused code elimination
- **Minification**: Terser for optimal compression
- **Asset Optimization**: Automatic image and font optimization
- **CDN**: Global edge network via Vercel

## Security Features

- **Content Security Policy**: XSS protection
- **HTTPS Only**: Automatic SSL/TLS
- **No Source Maps**: Production builds exclude source maps
- **Secure Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
- **Private Key Security**: Client-side key generation only

## Troubleshooting

### Common Issues

#### 1. WalletConnect Connection Issues

```bash
# Check if Project ID is set
echo $VITE_WALLETCONNECT_PROJECT_ID

# Verify in browser console
console.log(import.meta.env.VITE_WALLETCONNECT_PROJECT_ID)
```

#### 2. Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vercel
npm install
npm run build
```

#### 3. TypeScript Errors

```bash
# Run type checking
npm run type-check

# Fix common issues
npm run lint --fix
```

#### 4. Environment Variables Not Loading

- Ensure variables start with `VITE_`
- Check Vercel dashboard environment variables
- Redeploy after changing environment variables

### Debugging

Enable development mode debugging:

```bash
# Set debug mode
VITE_DEBUG=true npm run dev

# Check console for detailed logs
```

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and support:

1. Check the [troubleshooting guide](#troubleshooting)
2. Search existing issues
3. Create a new issue with detailed information

## Roadmap

- [ ] Real zk-SNARK implementation
- [ ] Additional privacy features
- [ ] Mobile app
- [ ] Multi-signature support
- [ ] Cross-chain bridges
- [ ] Advanced analytics

---

**⚠️ Security Notice**: This is a demo application. The zero-knowledge proofs are simulated for demonstration purposes. Do not use with real funds without proper security audits.
