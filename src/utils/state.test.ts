import { describe, it, expect } from 'vitest';
import { nextState } from './state';
import type { Grid } from '../types';

function emptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => new Array(size).fill(false) as boolean[]);
}

function setCell(grid: Grid, row: number, col: number): Grid {
  return grid.map((r, ri) =>
    ri === row ? r.map((c, ci) => (ci === col ? true : c)) : r
  );
}

function setCells(grid: Grid, cells: [number, number][]): Grid {
  let g = grid;
  for (const [r, c] of cells) {
    g = setCell(g, r, c);
  }
  return g;
}

function liveCells(grid: Grid): [number, number][] {
  const cells: [number, number][] = [];
  grid.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell) cells.push([i, j]);
    })
  );
  return cells;
}

describe('nextState', () => {
  it('empty grid stays empty', () => {
    const grid = emptyGrid(5);
    expect(liveCells(nextState(grid))).toEqual([]);
  });

  it('single cell dies (underpopulation)', () => {
    const grid = setCells(emptyGrid(5), [[2, 2]]);
    expect(liveCells(nextState(grid))).toEqual([]);
  });

  it('block (still life) remains unchanged', () => {
    const cells: [number, number][] = [[1, 1], [1, 2], [2, 1], [2, 2]];
    const grid = setCells(emptyGrid(5), cells);
    expect(liveCells(nextState(grid))).toEqual(cells);
  });

  it('blinker oscillates', () => {
    // Horizontal blinker
    const horizontal: [number, number][] = [[2, 1], [2, 2], [2, 3]];
    const vertical: [number, number][] = [[1, 2], [2, 2], [3, 2]];
    const grid = setCells(emptyGrid(5), horizontal);

    const gen1 = nextState(grid);
    expect(liveCells(gen1)).toEqual(vertical);

    const gen2 = nextState(gen1);
    expect(liveCells(gen2)).toEqual(horizontal);
  });

  it('glider moves down-right', () => {
    //  .X.
    //  ..X
    //  XXX
    const gen0: [number, number][] = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
    const grid = setCells(emptyGrid(6), gen0);

    // After 4 generations, glider should shift (1,1)
    let g = grid;
    for (let i = 0; i < 4; i++) g = nextState(g);
    const expected: [number, number][] = [[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]];
    expect(liveCells(g)).toEqual(expected);
  });

  it('overcrowding kills cells', () => {
    // Plus pattern: center has 4 neighbors -> dies
    const cells: [number, number][] = [[1, 2], [2, 1], [2, 2], [2, 3], [3, 2]];
    const grid = setCells(emptyGrid(5), cells);
    const result = nextState(grid);
    expect(result[2]![2]).toBe(false); // center dies
  });

  it('dead cell with exactly 3 neighbors is born', () => {
    const cells: [number, number][] = [[1, 1], [1, 2], [2, 1]];
    const grid = setCells(emptyGrid(5), cells);
    const result = nextState(grid);
    expect(result[2]![2]).toBe(true); // born at (2,2)
  });
});
