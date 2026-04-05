import { describe, it, expect } from 'vitest';
import { nextState, emptyGrid } from './state';
import type { Grid } from '../types';

function setCells(grid: Grid, size: number, cells: [number, number][]): Grid {
  for (const [r, c] of cells) grid[r * size + c] = 1;
  return grid;
}

function liveCells(grid: Grid, size: number): [number, number][] {
  const cells: [number, number][] = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i * size + j]) cells.push([i, j]);
    }
  }
  return cells;
}

function step(prev: Grid, size: number): Grid {
  return nextState(prev, emptyGrid(size), size);
}

describe('nextState', () => {
  it('empty grid stays empty', () => {
    expect(liveCells(step(emptyGrid(5), 5), 5)).toEqual([]);
  });

  it('single cell dies (underpopulation)', () => {
    const grid = setCells(emptyGrid(5), 5, [[2, 2]]);
    expect(liveCells(step(grid, 5), 5)).toEqual([]);
  });

  it('block (still life) remains unchanged', () => {
    const cells: [number, number][] = [[1, 1], [1, 2], [2, 1], [2, 2]];
    const grid = setCells(emptyGrid(5), 5, cells);
    expect(liveCells(step(grid, 5), 5)).toEqual(cells);
  });

  it('blinker oscillates', () => {
    const horizontal: [number, number][] = [[2, 1], [2, 2], [2, 3]];
    const vertical: [number, number][] = [[1, 2], [2, 2], [3, 2]];
    const grid = setCells(emptyGrid(5), 5, horizontal);

    const gen1 = step(grid, 5);
    expect(liveCells(gen1, 5)).toEqual(vertical);

    const gen2 = step(gen1, 5);
    expect(liveCells(gen2, 5)).toEqual(horizontal);
  });

  it('glider moves down-right', () => {
    //  .X.
    //  ..X
    //  XXX
    const gen0: [number, number][] = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
    let g = setCells(emptyGrid(6), 6, gen0);
    for (let i = 0; i < 4; i++) g = step(g, 6);
    const expected: [number, number][] = [[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]];
    expect(liveCells(g, 6)).toEqual(expected);
  });

  it('overcrowding kills cells', () => {
    // Plus pattern: center has 4 neighbors -> dies
    const cells: [number, number][] = [[1, 2], [2, 1], [2, 2], [2, 3], [3, 2]];
    const grid = setCells(emptyGrid(5), 5, cells);
    const result = step(grid, 5);
    expect(result[2 * 5 + 2]).toBe(0); // center dies
  });

  it('dead cell with exactly 3 neighbors is born', () => {
    const cells: [number, number][] = [[1, 1], [1, 2], [2, 1]];
    const grid = setCells(emptyGrid(5), 5, cells);
    const result = step(grid, 5);
    expect(result[2 * 5 + 2]).toBe(1); // born at (2,2)
  });

  it('double-buffer: successive nextState calls do not alias', () => {
    // Horizontal blinker at gen 0
    const a = setCells(emptyGrid(5), 5, [[2, 1], [2, 2], [2, 3]]);
    const b = emptyGrid(5);
    const c = emptyGrid(5);

    nextState(a, b, 5); // b = vertical
    nextState(b, c, 5); // c = horizontal again

    // a is untouched
    expect(liveCells(a, 5)).toEqual([[2, 1], [2, 2], [2, 3]]);
    // b is vertical, not corrupted by second call
    expect(liveCells(b, 5)).toEqual([[1, 2], [2, 2], [3, 2]]);
    // c is back to horizontal
    expect(liveCells(c, 5)).toEqual([[2, 1], [2, 2], [2, 3]]);
  });
});
