import { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { sdk } from '@farcaster/miniapp-sdk';
import { Game2048 } from './components/Game2048';
import { WalletConnect } from './components/WalletConnect';
import { Button } from './components/ui/button';

const queryClient = new QueryClient();

function AppContent() {
  const [isPaid, setIsPaid] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      try {
        await sdk.actions.ready();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
        setIsReady(true); // Still show the app even if SDK fails
      }
    };

    initSDK();
  }, []);

  const handlePaymentSuccess = () => {
    setIsPaid(true);
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
  };

  const handleShare = async () => {
    try {
      const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
        `I just scored ${finalScore} in Far2048! 🎮\n\nCan you beat my score?`
      )}&embeds[]=${encodeURIComponent(window.location.href)}`;
      
      window.open(shareUrl, '_blank');
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (finalScore !== null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-purple-950 p-8 rounded-2xl border-2 border-purple-400/50 shadow-2xl shadow-purple-500/50 max-w-md w-full">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
              Game Over!
            </h2>
            
            <div className="space-y-2">
              <div className="text-purple-300 text-lg">Your Score</div>
              <div className="text-6xl font-bold text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                {finalScore}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleShare}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50 border border-purple-400/30"
              >
                Share on Farcaster
              </Button>
              
              <Button
                onClick={() => {
                  setFinalScore(null);
                  setIsPaid(false);
                }}
                variant="outline"
                className="w-full bg-purple-900/50 hover:bg-purple-800/50 text-white py-6 text-lg rounded-xl border-2 border-purple-400/50 shadow-lg shadow-purple-500/30"
              >
                Play Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isPaid) {
    return <WalletConnect onPaymentSuccess={handlePaymentSuccess} />;
  }

  return <Game2048 onGameOver={handleGameOver} isPaid={isPaid} />;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
