const playerActions = {
  play: function (gameBoard) {
    //xCoordinate, yCoordinate, gameBoard
    let = xCoordinate = window.prompt("x?");
    let = yCoordinate = window.prompt("y?");

    if (!gameBoard[xCoordinate][yCoordinate]) {
      gameBoard[xCoordinate][yCoordinate] = this.marker;
    }
  },
};
function Player(name, marker) {
  let returnedPlayer = { name, marker };
  Object.assign(returnedPlayer, playerActions);
  return returnedPlayer;
}

let gameBoardCreator = (function () {
  let boardSize = 3;
  let board = [];
  for (let i = 0; i < boardSize; i++) {
    let newRow = [];
    for (let j = 0; j < boardSize; j++) {
      newRow[j] = "";
    }
    board[i] = newRow;
  }
  function getBoard() {
    return board;
  }
  return {
    getBoard,
  };
})();
let gameController = (function () {
  function checkWinOnAxis(gameBoard) {
    let boardSize = gameBoard.length;

    for (let row = 0; row < boardSize; row++) {
      if (gameBoard[row].includes("")) {
        continue;
      }
      if (
        gameBoard[row][0] == gameBoard[row][1] &&
        gameBoard[row][0] == gameBoard[row][2]
      ) {
        return true;
      }
    }
    let transposedgameBoard = TransposeGameBoard(gameBoard);

    for (let row = 0; row < boardSize; row++) {
      if (transposedgameBoard[row].includes("")) {
        continue;
      }
      if (
        transposedgameBoard[row][0] == transposedgameBoard[row][1] &&
        transposedgameBoard[row][0] == transposedgameBoard[row][2]
      ) {
        return true;
      }
    }

    return false;
  }

  function checkWinOnDiagonal(gameBoard) {
    if (gameBoard[1][1] == "") {
      return false;
    }
    if (
      (gameBoard[0][0] == gameBoard[1][1] &&
        gameBoard[0][0] == gameBoard[2][2]) ||
      (gameBoard[0][2] == gameBoard[1][1] && gameBoard[0][2] == gameBoard[2][0])
    ) {
      return true;
    }
    return false;
  }

  function TransposeGameBoard(gameBoard) {
    let transposedgameBoard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    let transposeVariable = 2;
    for (let row = 0; row < 3; row++) {
      if (row == 0) {
        transposeVariable = 2;
      } else if (row == 1) {
        transposeVariable = 1;
      } else {
        transposeVariable = 0;
      }
      for (let col = 0; col < 3; col++) {
        transposedgameBoard[row][col] = gameBoard[col][transposeVariable];
      }
    }
    return transposedgameBoard;
  }

  function checkWin(gameBoard) {
    if (checkWinOnDiagonal(gameBoard) || checkWinOnAxis(gameBoard)) {
      return true;
    }
    return false;
  }
  return {
    checkWin,
  };
})();

let player1 = Player("ahmed", "x");
let player2 = Player("mohamed", "o");
let gameBoard = gameBoardCreator.getBoard();

console.log(gameBoard);

console.log(gameController.checkWin(gameBoard));

let win = false;
let turn = 1;
console.log(player1.marker);
console.log(player2.marker);

while (!win) {
  if (turn % 2 == 0) {
    player1.play(gameBoard);
  } else {
    player2.play(gameBoard);
  }

  if (gameController.checkWin(gameBoard)) {
    win = true;
    console.log("won");
  }
  turn++;
}
