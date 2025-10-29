# 2048 Farcaster Mini App

A classic 2048 puzzle game built as a Farcaster Mini App on Base mainnet with a purple/white neon theme.

## Features

- 🎮 Classic 2048 gameplay with smooth animations
- 💜 Purple and white neon-themed UI with glowing borders
- 💰 0.00001 ETH entry fee payment system on Base
- 🔗 Farcaster wallet integration (no wallet selection needed)
- 📱 Share your score directly to Farcaster
- ⚡ Built with React, TypeScript, Vite, and Wagmi
- 🚀 Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 22.11.0 or higher
- pnpm (or npm/yarn)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the payment address in `.env`:

```env
VITE_PAYMENT_ADDRESS=0x8560f7282C3Dd9ba2d0dB6C653e5cE65a055D112
```

5. Update the payment address in `src/components/WalletConnect.tsx`:

```typescript
const PAYMENT_ADDRESS = '0x8560f7282C3Dd9ba2d0dB6C653e5cE65a055D112';
```

### Development

Run the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the environment variable:
   - `VITE_PAYMENT_ADDRESS`: Your Ethereum address for receiving payments
4. Deploy!

### Farcaster Mini App Configuration

After deployment, update `farcaster.json` with your actual domain:

```json
{
  "name": "2048 Game",
  "version": "1.0.0",
  "iconUrl": "https://your-domain.vercel.app/favicon.ico",
  "splashImageUrl": "https://your-domain.vercel.app/splash.png",
  "splashBackgroundColor": "#1a0b2e",
  "homeUrl": "https://your-domain.vercel.app"
}
```

### Publishing to Farcaster

1. Enable Developer Mode in Farcaster:
   - Visit: https://farcaster.xyz/~/settings/developer-tools
   - Toggle on "Developer Mode"

2. Create a manifest for your Mini App using the Farcaster developer tools

3. Share your app in Farcaster feeds

## How to Play

1. **Connect Wallet**: Connect your Farcaster wallet
2. **Pay Entry Fee**: Pay 0.1 ETH + gas fees to start playing
3. **Play**: Use arrow keys (desktop) or swipe (mobile) to move tiles
4. **Merge Tiles**: Combine tiles with the same number to create larger numbers
5. **Reach 2048**: Try to create a tile with the value 2048
6. **Share Score**: When the game ends, share your score on Farcaster

## Game Controls

- **Desktop**: Arrow keys or WASD
- **Mobile**: Swipe in any direction

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Wagmi + Viem (Base mainnet)
- **Farcaster**: @farcaster/miniapp-sdk
- **Deployment**: Vercel

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Game2048.tsx     # Main game component
│   ├── GameBoard.tsx    # Game board grid
│   ├── GameHeader.tsx   # Score display
│   ├── GameOverlay.tsx  # Game over/win overlay
│   ├── Tile.tsx         # Individual tile component
│   └── WalletConnect.tsx # Wallet connection & payment
├── config/
│   └── wagmi.ts         # Wagmi configuration
├── types/
│   └── game.ts          # Game type definitions
├── utils/
│   └── gameLogic.ts     # 2048 game logic
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Environment Variables

- `VITE_PAYMENT_ADDRESS`: Ethereum address to receive entry fee payments

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
