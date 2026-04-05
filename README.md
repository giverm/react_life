# react_life

Conway's Game of Life, rendered on an HTML canvas. A 64×64 grid of cells evolves one generation at a time under the classic Life rules, and you can draw initial configurations by clicking or dragging on the board.

## The rules

Every cell is either alive or dead. On each tick, each cell's next state is determined by its eight neighbors:

- A **live** cell with 2 or 3 live neighbors survives. Otherwise it dies (underpopulation or overcrowding).
- A **dead** cell with exactly 3 live neighbors becomes alive (reproduction).

From these three lines of logic you get still lifes, oscillators, spaceships, guns, and an endless zoo of emergent behavior.

## Running it

Prerequisites: Node 20+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically http://localhost:5173).

### Other scripts

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR                   |
| `npm run build`   | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally                   |
| `npm test`        | Run the Vitest unit tests once                       |
| `npm run lint`    | Run ESLint across `.ts` / `.tsx` files               |
| `npm run format`  | Run Prettier with `--write` over `src/`              |

## Controls

- **Click** a cell to toggle it between alive and dead.
- **Click and drag** to paint a region. The mode is determined by the first cell you toggle: if you turned a dead cell on, the drag paints alive; if you turned a live cell off, the drag erases.
- **START / STOP** run and pause the simulation.
- **STEP** advances exactly one generation.
- **CLEAR** empties the grid.
- **RANDOM** fills the grid with a 50/50 random pattern.

## How it works

The grid is a flat `Uint8Array` of length `SIZE * SIZE`, indexed as `grid[i * SIZE + j]`. Two buffers are pre-allocated and swapped on each tick, so advancing the simulation is zero-allocation in steady state.

Rendering is a single `<canvas>` rather than per-cell DOM nodes. The canvas is sized with `devicePixelRatio` for crisp output on retina displays. Each frame fills a background rectangle in the gridline color, then draws each cell as a 1px-inset rectangle — the inset gaps form the gridlines for free, with no extra draw calls.

The tick loop is a `requestAnimationFrame` with a time accumulator targeting a configurable generations-per-second rate. Delta is clamped so a backgrounded tab returning after several seconds can't drain hundreds of queued generations in a single frame.

All of this lives behind a single `useLifeWorld` hook that owns the canvas ref, the buffer pair, the pointer handlers, and the rAF loop, and exposes a small imperative API (`step`, `clear`, `randomize`, `setRunning`). `World.tsx` is a thin wrapper that wires the hook to button controls.

## Project layout

```
src/
  components/
    World.tsx          top-level component: canvas + controls
    world.css
  hooks/
    useLifeWorld.ts    buffers, draw, pointer input, tick loop
  utils/
    state.ts           nextState, emptyGrid, randomGrid
    state.test.ts      Vitest unit tests for the game logic
  constants.ts         SIZE, CELL_PX, GPS
  types.ts             Grid = Uint8Array
  main.tsx             app entry
```

## Tech stack

Vite, React 19, TypeScript, Vitest, ESLint (with `typescript-eslint`), Prettier.
