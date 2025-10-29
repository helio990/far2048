import { Tile as TileType } from '../types/game';
import { Tile } from './Tile';

interface GameBoardProps {
  tiles: TileType[];
}

export const GameBoard = ({ tiles }: GameBoardProps) => {
  return (
    <div className="relative bg-purple-900/30 p-4 rounded-2xl shadow-2xl border-2 border-purple-500/30 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl pointer-events-none" />
      
      {/* Grid background */}
      <div className="grid grid-cols-4 gap-3 relative z-0">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-purple-950/50 rounded-lg border border-purple-500/20 shadow-inner"
          />
        ))}
      </div>

      {/* Tiles */}
      <div className="absolute inset-4 z-10">
        {tiles.map(tile => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};
