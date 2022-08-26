import React, { useState } from 'react';
import Square from "./square";
import "./board.css";

function Board({ world, setWorld }) {
  const [drawing, setDrawing] = useState(false);

  function renderSquare(i, j) {
    return ( 
      <Square 
        active={world[i][j]}
        onMouseDown={() => handleSquareClick(i,j)}
        onMouseOver={() => handleDrawing(i,j)}
        onTouch={() => handleSquareClick(i,j)}
      />
    );
  }

  function handleSquareClick(i, j) {
    const newWorld = world.slice();
    newWorld[i][j] = !world[i][j];
    setWorld(newWorld);
  }

  function handleDrawing(i, j) {
    if (drawing) { 
      const newWorld = world.slice();
      newWorld[i][j] = true; 
      setWorld(newWorld);
    }
  }

  return (
    <div 
      onMouseDown={() => setDrawing(true)}
      onMouseUp={() => setDrawing(false)}
    >
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
