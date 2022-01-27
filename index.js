/*==========================================
Helper Functions
*/
function loadElementsIntoArray(elementSelector) {
  return Array.from(document.querySelectorAll(elementSelector));
}
//==========================================

const playerActions = {
  play: function (xCoordinate, yCoordinate, gameBoard) {
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
  let gameBoardSize = 3;
  let gameBoard = [];
  for (let i = 0; i < gameBoardSize; i++) {
    let newRow = [];
    for (let j = 0; j < gameBoardSize; j++) {
      newRow[j] = "";
    }
    gameBoard[i] = newRow;
  }

  function getGameBoard() {
    return gameBoard;
  }

  return {
    getGameBoard,
  };
})();

let gameController = (function () {
  function checkWinOnRows(gameBoard) {
    let gameboardSize = gameBoard.length;
    for (let row = 0; row < gameboardSize; row++) {
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
  }

  function checkWinOnAxis(gameBoard) {
    let transposedgameBoard = TransposeGameBoard(gameBoard); //make columns rows

    if (checkWinOnRows(gameBoard) || checkWinOnRows(transposedgameBoard)) {
      //check both rows(normal Board) and columns (transposed board)
      return true;
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

let XMarker = "./assets/x.jpg";
let OMarker = "./assets/o.jpg";

let gameBoard = gameBoardCreator.getGameBoard();

let win = false;
let turn = 1;

let gameBoardCells = loadElementsIntoArray(".GameBoardCellDisplay");
gameBoardCells.forEach((cell) => {
  cell.addEventListener("click", (event) => {
    if (!win) {
      console.log(gameBoard);
      let image = document.createElement("img");
      event.target.append(image);
      [cellXCoordinate, cellYCoordinate] = [
        Number.parseInt(cell.classList[1][4]),
        Number.parseInt(cell.classList[1][5]),
      ];
      if (turn % 2 == 0) {
        image.src = "./assets/o.jpg";
        player2.play(cellXCoordinate, cellYCoordinate, gameBoard);
      } else {
        player1.play(cellXCoordinate, cellYCoordinate, gameBoard);

        image.src = "./assets/x.jpg";
      }
      image.classList.add("Marker");
      if (gameController.checkWin(gameBoard)) {
        win = true;
        console.log("won");
      }

      turn++;
    }
  });
});
