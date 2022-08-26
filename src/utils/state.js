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
  const size = squares.length;
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

    if (ni >= 0 && nj >= 0 && ni < size && nj < size && squares[ni][nj]) {
      neighbors++;
    }
  });

  return neighbors;
}

export { nextState };
