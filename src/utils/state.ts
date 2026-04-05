import type { Grid } from '../types';

export function emptyGrid(size: number): Grid {
  return new Uint8Array(size * size);
}

export function randomGrid(size: number): Grid {
  const grid = new Uint8Array(size * size);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < 0.5 ? 1 : 0;
  }
  return grid;
}

export function nextState(prev: Grid, out: Grid, size: number): Grid {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const idx = i * size + j;
      const count = countNeighbors(i, j, prev, size);
      const alive = prev[idx] === 1;
      out[idx] = alive
        ? (count === 2 || count === 3 ? 1 : 0)
        : (count === 3 ? 1 : 0);
    }
  }
  return out;
}

function countNeighbors(i: number, j: number, grid: Grid, size: number): number {
  let neighbors = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if (di === 0 && dj === 0) continue;
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && nj >= 0 && ni < size && nj < size) {
        neighbors += grid[ni * size + nj]!;
      }
    }
  }
  return neighbors;
}
