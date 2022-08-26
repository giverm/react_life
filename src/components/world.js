import React, { useLayoutEffect, useState } from 'react';
import Board from './board'
import { nextState } from '../utils/state'
import './world.css'

function World() 
{
  const SIZE = 64;
  const [world, setWorld] = useState(freshWorld());
  const [running, setRunning] = useState(false);

  function freshWorld() {
    return Array.from(Array(SIZE), () => new Array(SIZE).fill(false));
  }

  function randomWorld() {
    const states = [false, true];
    const squares = freshWorld();
    squares.forEach((row, i) => {
      row.forEach((square, j) => { 
          squares[i][j] = states[Math.floor(Math.random()*states.length)]
        })
      });

    setWorld(squares);
  }

  function clearWorld() {
    setWorld(freshWorld());
  }

  function nextStep() {
    const newWorld = nextState(world);
    setWorld(newWorld);
  }

  useLayoutEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        nextStep();
      }, 50);
    } 
    return () => clearInterval(interval);
  });

  return (
    <div className="world">
      <div className="world-board">
        <h1>Game of Life!</h1>
        <Board world={world} setWorld={setWorld} />
        <div className="btn-toolbar mt-2 justify-content-between" role="toolbar">
          <div className="btn-group" role="group">
            <button className='btn btn-outline-dark' onClick={() => setRunning(true)}>START</button> 
            <button className='btn btn-outline-dark' onClick={() => setRunning(false)}>STOP</button> 
            <button className='btn btn-outline-dark' onClick={() => nextStep()}>STEP</button>
          </div>
          <div className="btn-group" role="group">
            <button className='btn btn-outline-dark' onClick={() => clearWorld()}>CLEAR</button>
            <button className='btn btn-outline-dark' onClick={() => randomWorld()}>RANDOM</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default World;
