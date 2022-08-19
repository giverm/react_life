import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

const SIZE = 80;

function Square(props) {
  const classNames = ["square"];
  if (props.active) {
    classNames.push("active");
  }

  return (
    <button className={classNames.join(" ")} onClick={props.onClick}></button>
  );
}

function freshBoard() {
  return Array.from(Array(SIZE), () => new Array(SIZE).fill(false));
}

function randomBoard() {
  const states = [false, true];
  const board = freshBoard();
  board.forEach((row, i) => {
    row.forEach((square, j) => {
      board[i][j] = states[Math.floor(Math.random() * states.length)];
    });
  });

  return board;
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: freshBoard(),
      isRunning: false,
    };
  }

  handleClick(i, j) {
    const squares = this.state.squares.slice();
    squares[i][j] = !this.state.squares[i][j];
    this.setState({
      squares: squares,
      isRunning: this.state.isRunning,
    });
  }

  renderSquare(i, j) {
    return (
      <Square
        active={this.state.squares[i][j]}
        onClick={() => this.handleClick(i, j)}
      />
    );
  }

  updateState() {
    const squares = nextState(this.state.squares);
    this.setState({
      squares: squares,
      isRunning: this.state.isRunning,
    });
  }

  runLife() {
    this.updateState();
    this.timeoutHandler = window.setTimeout(() => {
      this.runLife();
    }, 50);
  }

  stopLife() {
    this.setState({
      squares: this.state.squares,
      isRunning: false,
    });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  clearBoard() {
    this.setState({
      squares: freshBoard(),
      isRunning: false,
    });
  }

  randomize() {
    this.setState({
      squares: randomBoard(),
      isRunning: false,
    });
  }

  render() {
    return (
      <div>
        {this.state.squares.map((sqs, i) => (
          <div className="board-row">
            {sqs.map((sq, j) => this.renderSquare(i, j))}
          </div>
        ))}
        <div
          className="btn-toolbar mt-3 justify-content-between"
          role="toolbar"
        >
          <div className="btn-group mr-3" role="group">
            <button
              className="btn btn-outline-dark"
              onClick={() => this.runLife()}
            >
              START
            </button>
            <button
              className="btn btn-outline-dark"
              onClick={() => this.stopLife()}
            >
              STOP
            </button>
            <button
              className="btn btn-outline-dark"
              onClick={() => this.updateState()}
            >
              STEP
            </button>
          </div>
          <div className="btn-group mr-3" role="group">
            <button
              className="btn btn-outline-dark"
              onClick={() => this.clearBoard()}
            >
              CLEAR
            </button>
            <button
              className="btn btn-outline-dark"
              onClick={() => this.randomize()}
            >
              RANDOM
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <h1>Game of Life!</h1>
          <Board />
        </div>
      </div>
    );
  }
}

function nextState(squares) {
  const newSquares = JSON.parse(JSON.stringify(squares));
  newSquares.forEach((row, i) => {
    row.forEach((square, j) => {
      const count = countNeighbors(i, j, squares);
      if (square) {
        if (count < 2 || count > 3) {
          newSquares[i][j] = false;
        }
      } else {
        if (count === 3) {
          newSquares[i][j] = true;
        }
      }
    });
  });

  return newSquares;
}

function countNeighbors(i, j, squares) {
  const shift = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
  ];
  let neighbors = 0;

  shift.forEach((step) => {
    const ni = i + step[0];
    const nj = j + step[1];

    if (ni >= 0 && nj >= 0 && ni < SIZE && nj < SIZE && squares[ni][nj]) {
      neighbors++;
    }
  });

  return neighbors;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
