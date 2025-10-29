import { useAccount, useConnect, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface WalletConnectProps {
  onPaymentSuccess: () => void;
}

const ENTRY_FEE = '0.00001'; // Entry fee
const PAYMENT_ADDRESS = import.meta.env.VITE_PAYMENT_ADDRESS || '0x8560f7282C3Dd9ba2d0dB6C653e5cE65a055D112'; // Replace with your address

export const WalletConnect = ({ onPaymentSuccess }: WalletConnectProps) => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransaction, data: hash, isPending } = useSendTransaction();
  const [hasPaid, setHasPaid] = useState(false);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && !hasPaid) {
      setHasPaid(true);
      onPaymentSuccess();
    }
  }, [isSuccess, hasPaid, onPaymentSuccess]);

  const handlePayment = async () => {
    try {
      sendTransaction({
        to: PAYMENT_ADDRESS,
        value: parseEther(ENTRY_FEE),
      });
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
            Far2048
          </h1>
          <p className="text-purple-300 text-lg">
            Play the classic puzzle game on Farcaster
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 p-8 rounded-2xl border-2 border-purple-400/50 shadow-2xl shadow-purple-500/50 backdrop-blur-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="text-purple-300 text-sm uppercase tracking-wider">Entry Fee</div>
            <div className="text-5xl font-bold text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
              {ENTRY_FEE} ETH
            </div>
            <div className="text-purple-400 text-sm">+ gas fees on Base</div>
          </div>

          <div className="space-y-3">
            {!isConnected ? (
              <Button
                onClick={() => connect({ connector: connectors[0] })}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50 border border-purple-400/30"
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <div className="bg-purple-950/50 p-4 rounded-xl border border-purple-400/30">
                  <div className="text-purple-300 text-xs uppercase tracking-wider mb-1">
                    Connected Wallet
                  </div>
                  <div className="text-white font-mono text-sm break-all">
                    {address}
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isPending || isConfirming}
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50 border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending || isConfirming ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isPending ? 'Confirm in Wallet...' : 'Processing...'}
                    </span>
                  ) : (
                    'Pay & Start Playing'
                  )}
                </Button>
              </>
            )}
          </div>

          <div className="space-y-2 text-sm text-purple-300">
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Play until you run out of moves</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Share your score on Farcaster</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Compete with friends</span>
            </div>
          </div>
        </div>

        <div className="text-center text-purple-400 text-sm">
          Powered by Base • Farcaster Mini App
        </div>
      </div>
    </div>
  );
};
