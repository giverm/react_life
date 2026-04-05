import { useEffect, useState } from 'react';
import type { Grid } from '../types';
import { SIZE, TICK_MS } from '../constants';
import Board from './Board';
import { nextState } from '../utils/state';
import './world.css';

function freshWorld(): Grid {
  return Array.from(Array(SIZE), () => new Array(SIZE).fill(false) as boolean[]);
}

function World() {
  const [world, setWorld] = useState(freshWorld);
  const [running, setRunning] = useState(false);

  function randomWorld() {
    setWorld(Array.from(Array(SIZE), () =>
      Array.from(Array(SIZE), () => Math.random() < 0.5)
    ));
  }

  function clearWorld() {
    setWorld(freshWorld());
  }

  function nextStep() {
    setWorld(prev => nextState(prev));
  }

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setWorld(prev => nextState(prev));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="world">
      <div className="world-board">
        <h1>Game of Life!</h1>
        <Board world={world} setWorld={setWorld} />
        <div className="controls">
          <div className="btn-group">
            <button className="btn" onClick={() => setRunning(true)}>START</button>
            <button className="btn" onClick={() => setRunning(false)}>STOP</button>
            <button className="btn" onClick={() => nextStep()}>STEP</button>
          </div>
          <div className="btn-group">
            <button className="btn" onClick={() => clearWorld()}>CLEAR</button>
            <button className="btn" onClick={() => randomWorld()}>RANDOM</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default World;
