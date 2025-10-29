export type Tile = {
  id: number;
  value: number;
  position: { row: number; col: number };
  mergedFrom?: Tile[];
  isNew?: boolean;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameState = {
  tiles: Tile[];
  score: number;
  gameOver: boolean;
  won: boolean;
};
