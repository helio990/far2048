import { useState, useEffect, useCallback } from 'react';
import { initializeGame, move } from '../utils/gameLogic';
import { Direction, GameState } from '../types/game';
import { GameBoard } from './GameBoard';
import { GameHeader } from './GameHeader';
import { GameOverlay } from './GameOverlay';
import { Button } from './ui/button';

interface Game2048Props {
  onGameOver: (score: number) => void;
  isPaid: boolean;
}

export const Game2048 = ({ onGameOver, isPaid }: Game2048Props) => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleMove = useCallback((direction: Direction) => {
    if (!isPaid || gameState.gameOver) return;
    
    setGameState(prevState => {
      const newState = move(prevState, direction);
      if (newState.gameOver) {
        setTimeout(() => onGameOver(newState.score), 500);
      }
      return newState;
    });
  }, [gameState.gameOver, isPaid, onGameOver]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPaid) return;
    
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    };

    const direction = keyMap[e.key];
    if (direction) {
      e.preventDefault();
      handleMove(direction);
    }
  }, [handleMove, isPaid]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPaid) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isPaid || !touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        handleMove(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        handleMove(deltaY > 0 ? 'down' : 'up');
      }
    }

    setTouchStart(null);
  };

  const handleRestart = () => {
    setGameState(initializeGame());
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-md space-y-6">
        <GameHeader score={gameState.score} />
        
        <div className="relative">
          <GameBoard tiles={gameState.tiles} />
          {!isPaid && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4 p-6">
                <div className="text-white text-xl font-bold">
                  Pay 0.1 ETH to Play
                </div>
                <div className="text-purple-300 text-sm">
                  Connect your wallet and pay the entry fee to start playing
                </div>
              </div>
            </div>
          )}
        </div>

        {isPaid && (
          <div className="flex justify-center">
            <Button
              onClick={handleRestart}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-purple-500/50 border border-purple-400/30"
            >
              New Game
            </Button>
          </div>
        )}

        <GameOverlay 
          gameState={gameState} 
          onRestart={handleRestart}
          onShare={() => onGameOver(gameState.score)}
        />
      </div>
    </div>
  );
};
