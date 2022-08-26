import Square from "./square"
import "./board.css"

function Board({ world, setWorld }) {
  function renderSquare(i, j) {
    return ( 
      <Square 
        active={world[i][j]}
        onClick={() => handleSquareClick(i,j)}
      />
    );
  }

  function handleSquareClick(i, j) {
    const newWorld = world.slice();
    newWorld[i][j] = !world[i][j]
    setWorld(newWorld);
  }

  return (
    <div>
      {world.map((sqs, i) => (
        <div className="board-row">
          {sqs.map((sq, j) => (
            renderSquare(i,j)
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
