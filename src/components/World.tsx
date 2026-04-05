import { useEffect, useState } from 'react';
import { SIZE, TICK_MS } from '../constants';
import Board from './Board';
import { nextState, emptyGrid, randomGrid } from '../utils/state';
import './world.css';

function World() {
  const [world, setWorld] = useState(() => emptyGrid(SIZE));
  const [running, setRunning] = useState(false);

  function randomWorld() {
    setWorld(randomGrid(SIZE));
  }

  function clearWorld() {
    setWorld(emptyGrid(SIZE));
  }

  function nextStep() {
    setWorld(prev => nextState(prev, emptyGrid(SIZE), SIZE));
  }

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setWorld(prev => nextState(prev, emptyGrid(SIZE), SIZE));
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
