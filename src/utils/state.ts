import type { Grid } from '../types';

export function nextState(squares: Grid): Grid {
  return squares.map((row, i) =>
    row.map((cell, j) => {
      const count = countNeighbors(i, j, squares);
      return cell ? (count === 2 || count === 3) : (count === 3);
    })
  );
}

function countNeighbors(i: number, j: number, squares: Grid): number {
  const size = squares.length;
  const shifts = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, 1], [1, 1], [1, 0],
    [1, -1], [0, -1],
  ];
  let neighbors = 0;

  for (const [di, dj] of shifts) {
    const ni = i + di!;
    const nj = j + dj!;
    if (ni >= 0 && nj >= 0 && ni < size && nj < size && squares[ni]![nj]) {
      neighbors++;
    }
  }

  return neighbors;
}
