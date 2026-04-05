import type { Grid } from '../types';
import { SIZE } from '../constants';
import Square from './Square';
import './board.css';

interface BoardProps {
  world: Grid;
  setWorld: React.Dispatch<React.SetStateAction<Grid>>;
}

function Board({ world, setWorld }: BoardProps) {
  function handleSquareClick(i: number, j: number) {
    const newWorld = new Uint8Array(world);
    const idx = i * SIZE + j;
    newWorld[idx] = newWorld[idx] ? 0 : 1;
    setWorld(newWorld);
  }

  const rows: React.ReactElement[] = [];
  for (let i = 0; i < SIZE; i++) {
    const cells: React.ReactElement[] = [];
    for (let j = 0; j < SIZE; j++) {
      cells.push(
        <Square
          key={j}
          active={world[i * SIZE + j] === 1}
          onClick={() => handleSquareClick(i, j)}
        />
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {cells}
      </div>
    );
  }

  return <div>{rows}</div>;
}

export default Board;
