import { GameState } from '../types/game';
import { Button } from './ui/button';

interface GameOverlayProps {
  gameState: GameState;
  onRestart: () => void;
  onShare: () => void;
}

export const GameOverlay = ({ gameState, onRestart, onShare }: GameOverlayProps) => {
  if (!gameState.gameOver && !gameState.won) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-900 to-purple-950 p-8 rounded-2xl border-2 border-purple-400/50 shadow-2xl shadow-purple-500/50 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
            {gameState.won ? '🎉 You Won!' : 'Game Over'}
          </h2>
          
          <div className="space-y-2">
            <div className="text-purple-300 text-lg">Final Score</div>
            <div className="text-6xl font-bold text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
              {gameState.score}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onShare}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-purple-500/50 border border-purple-400/30"
            >
              Share Score on Farcaster
            </Button>
            
            <Button
              onClick={onRestart}
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
};
