import { Tile, Direction, GameState } from '../types/game';

const GRID_SIZE = 4;

let tileIdCounter = 0;

export const createTile = (row: number, col: number, value: number = 2): Tile => ({
  id: tileIdCounter++,
  value,
  position: { row, col },
  isNew: true,
});

export const initializeGame = (): GameState => {
  tileIdCounter = 0;
  const tiles: Tile[] = [];
  
  // Add two initial tiles
  const positions = getRandomEmptyPositions([], 2);
  positions.forEach(pos => {
    tiles.push(createTile(pos.row, pos.col, Math.random() < 0.9 ? 2 : 4));
  });

  return {
    tiles,
    score: 0,
    gameOver: false,
    won: false,
  };
};

const getRandomEmptyPositions = (tiles: Tile[], count: number): { row: number; col: number }[] => {
  const occupied = new Set(tiles.map(t => `${t.position.row},${t.position.col}`));
  const empty: { row: number; col: number }[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!occupied.has(`${row},${col}`)) {
        empty.push({ row, col });
      }
    }
  }

  const result: { row: number; col: number }[] = [];
  for (let i = 0; i < count && empty.length > 0; i++) {
    const index = Math.floor(Math.random() * empty.length);
    result.push(empty[index]);
    empty.splice(index, 1);
  }

  return result;
};

const buildGrid = (tiles: Tile[]): (Tile | null)[][] => {
  const grid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  tiles.forEach(tile => {
    grid[tile.position.row][tile.position.col] = tile;
  });
  return grid;
};

const traversals = (direction: Direction) => {
  const rows = Array.from({ length: GRID_SIZE }, (_, i) => i);
  const cols = Array.from({ length: GRID_SIZE }, (_, i) => i);

  if (direction === 'right') cols.reverse();
  if (direction === 'down') rows.reverse();

  return { rows, cols };
};

export const move = (state: GameState, direction: Direction): GameState => {
  const grid = buildGrid(state.tiles);
  const newTiles: Tile[] = [];
  const merged = new Set<string>();
  let scoreIncrease = 0;
  let moved = false;

  const { rows, cols } = traversals(direction);

  rows.forEach(row => {
    cols.forEach(col => {
      const tile = grid[row][col];
      if (!tile) return;

      let newRow = row;
      let newCol = col;
      let next = findFarthestPosition(grid, { row, col }, direction, merged);

      if (next.merge) {
        // Merge tiles
        newRow = next.merge.position.row;
        newCol = next.merge.position.col;
        const mergedValue = tile.value * 2;
        
        newTiles.push({
          ...tile,
          value: mergedValue,
          position: { row: newRow, col: newCol },
          mergedFrom: [tile, next.merge],
          isNew: false,
        });

        merged.add(`${newRow},${newCol}`);
        scoreIncrease += mergedValue;
        moved = true;

        // Remove the merged tile from grid
        grid[next.merge.position.row][next.merge.position.col] = null;
      } else {
        // Move tile
        newRow = next.farthest.row;
        newCol = next.farthest.col;

        if (newRow !== row || newCol !== col) {
          moved = true;
        }

        newTiles.push({
          ...tile,
          position: { row: newRow, col: newCol },
          isNew: false,
        });
      }

      grid[row][col] = null;
      grid[newRow][newCol] = newTiles[newTiles.length - 1];
    });
  });

  if (!moved) {
    return state;
  }

  // Add new tile
  const emptyPositions = getRandomEmptyPositions(newTiles, 1);
  if (emptyPositions.length > 0) {
    const pos = emptyPositions[0];
    newTiles.push(createTile(pos.row, pos.col, Math.random() < 0.9 ? 2 : 4));
  }

  const newScore = state.score + scoreIncrease;
  const won = !state.won && newTiles.some(t => t.value >= 2048);
  const gameOver = !won && !hasMovesAvailable(newTiles);

  return {
    tiles: newTiles,
    score: newScore,
    gameOver,
    won,
  };
};

const findFarthestPosition = (
  grid: (Tile | null)[][],
  position: { row: number; col: number },
  direction: Direction,
  merged: Set<string>
): { farthest: { row: number; col: number }; merge: Tile | null } => {
  let previous = position;
  let current = getNextPosition(position, direction);

  while (isWithinBounds(current)) {
    const tile = grid[current.row][current.col];
    const currentKey = `${current.row},${current.col}`;

    if (tile && tile.value === grid[position.row][position.col]?.value && !merged.has(currentKey)) {
      return { farthest: previous, merge: tile };
    }

    if (tile) {
      break;
    }

    previous = current;
    current = getNextPosition(current, direction);
  }

  return { farthest: previous, merge: null };
};

const getNextPosition = (position: { row: number; col: number }, direction: Direction) => {
  const offsets = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
  };

  const offset = offsets[direction];
  return {
    row: position.row + offset.row,
    col: position.col + offset.col,
  };
};

const isWithinBounds = (position: { row: number; col: number }) => {
  return position.row >= 0 && position.row < GRID_SIZE && 
         position.col >= 0 && position.col < GRID_SIZE;
};

const hasMovesAvailable = (tiles: Tile[]): boolean => {
  if (tiles.length < GRID_SIZE * GRID_SIZE) {
    return true;
  }

  const grid = buildGrid(tiles);

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = grid[row][col];
      if (!tile) continue;

      // Check adjacent tiles
      const directions: Direction[] = ['up', 'down', 'left', 'right'];
      for (const direction of directions) {
        const next = getNextPosition({ row, col }, direction);
        if (isWithinBounds(next)) {
          const nextTile = grid[next.row][next.col];
          if (nextTile && nextTile.value === tile.value) {
            return true;
          }
        }
      }
    }
  }

  return false;
};
