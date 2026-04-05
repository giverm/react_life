import { SIZE } from '../constants';
import { useLifeWorld } from '../hooks/useLifeWorld';
import './world.css';

function World() {
  const { canvasRef, setRunning, step, clear, randomize } = useLifeWorld(SIZE);

  return (
    <div className="world">
      <div className="world-board">
        <h1>Game of Life!</h1>
        <canvas ref={canvasRef} className="life-canvas" />
        <div className="controls">
          <div className="btn-group">
            <button className="btn" onClick={() => setRunning(true)}>
              START
            </button>
            <button className="btn" onClick={() => setRunning(false)}>
              STOP
            </button>
            <button className="btn" onClick={step}>
              STEP
            </button>
          </div>
          <div className="btn-group">
            <button className="btn" onClick={clear}>
              CLEAR
            </button>
            <button className="btn" onClick={randomize}>
              RANDOM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default World;
