import type { Grid } from '../types';
import Square from './Square';
import './board.css';

interface BoardProps {
  world: Grid;
  setWorld: React.Dispatch<React.SetStateAction<Grid>>;
}

function Board({ world, setWorld }: BoardProps) {
  function handleSquareClick(i: number, j: number) {
    const newWorld = world.map((row, ri) =>
      ri === i ? row.map((cell, ci) => (ci === j ? !cell : cell)) : row
    );
    setWorld(newWorld);
  }

  return (
    <div>
      {world.map((sqs, i) => (
        <div key={i} className="board-row">
          {sqs.map((_sq, j) => (
            <Square
              key={j}
              active={world[i]![j]!}
              onClick={() => handleSquareClick(i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
