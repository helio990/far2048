import { Tile as TileType } from '../types/game';
import { useEffect, useState } from 'react';

interface TileProps {
  tile: TileType;
}

const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: 'bg-purple-200 text-purple-900',
    4: 'bg-purple-300 text-purple-900',
    8: 'bg-purple-400 text-white',
    16: 'bg-purple-500 text-white',
    32: 'bg-purple-600 text-white',
    64: 'bg-purple-700 text-white',
    128: 'bg-purple-800 text-white',
    256: 'bg-purple-900 text-white',
    512: 'bg-fuchsia-600 text-white',
    1024: 'bg-fuchsia-700 text-white',
    2048: 'bg-fuchsia-800 text-white',
  };
  return colors[value] || 'bg-fuchsia-900 text-white';
};

const getTileSize = (value: number): string => {
  if (value >= 1024) return 'text-2xl';
  if (value >= 128) return 'text-3xl';
  return 'text-4xl';
};

export const Tile = ({ tile }: TileProps) => {
  const [isNew, setIsNew] = useState(tile.isNew);

  useEffect(() => {
    if (tile.isNew) {
      setIsNew(true);
      const timer = setTimeout(() => setIsNew(false), 200);
      return () => clearTimeout(timer);
    }
  }, [tile.isNew]);

  const position = {
    top: `${tile.position.row * 25}%`,
    left: `${tile.position.col * 25}%`,
  };

  return (
    <div
      className={`absolute w-[calc(25%-0.75rem)] aspect-square flex items-center justify-center rounded-lg font-bold transition-all duration-150 ${getTileColor(tile.value)} ${getTileSize(tile.value)} shadow-lg border-2 border-white/20 ${isNew ? 'scale-0 animate-[scale-in_0.2s_ease-out_forwards]' : 'scale-100'}`}
      style={position}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] rounded-lg pointer-events-none" />
      <span className="relative z-10 drop-shadow-lg">{tile.value}</span>
    </div>
  );
};
