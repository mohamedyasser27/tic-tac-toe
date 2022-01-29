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
  let ResultDisplay = document.querySelector(".ResultDisplay");

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

  function checkWin(gameBoard, turnsLeft, playerName) {
    if (checkWinOnDiagonal(gameBoard) || checkWinOnAxis(gameBoard)) {
      DisplayResult(true, turnsLeft, playerName);
    } else if (turnsLeft == 0) {
      DisplayResult(false, turnsLeft, playerName);
    }
  }

  function DisplayResult(winOrDraw, turnsLeft, playerName) {
    if (winOrDraw) {
      winOrDraw = true;
      ResultDisplay.children[0].textContent = `Congrtulations , ${playerName} won!!`;
      ResultDisplay.classList.remove("invisible");
      ResultDisplay.classList.add("dim");
    } else if (turnsLeft == 0) {
      ResultDisplay.children[0].textContent = "it's A Draw!!!";
      ResultDisplay.classList.remove("invisible");
      ResultDisplay.classList.add("dim");
    }
  }

  return {
    checkWin,
  };
})();

let player1 = Player("player 1", "x");
let player2 = Player("player 2", "o");

let XMarkerPath = "./assets/x.jpg";
let OMarkerPath = "./assets/o.jpg";

let gameBoard = gameBoardCreator.getGameBoard();

let winOrDraw = false;
let RoundNumber = 1;
let turnsLeft = gameBoard.length * 3;

let CurrentPlayer = document.querySelector(".CurrentPlayer");
CurrentPlayer.textContent = `${player1.name} turn`;
let gameBoardCells = loadElementsIntoArray(".GameBoardCellDisplay");
let reloadButton = document.querySelector(".ReloadBtn");

reloadButton.addEventListener("click", () => {
  location.reload();
});
gameBoardCells.forEach((cell) => {
  cell.addEventListener("click", (event) => {
    if (!winOrDraw) {
      turnsLeft--;
      let image = document.createElement("img");
      event.target.append(image);
      [cellXCoordinate, cellYCoordinate] = [
        Number.parseInt(cell.classList[1][4]), //Cell 00 (0,0),Cell 00 (0,1)
        Number.parseInt(cell.classList[1][5]),
      ];
      if (RoundNumber % 2 != 0) {
        image.src = XMarkerPath;
        player1.play(cellXCoordinate, cellYCoordinate, gameBoard);
        gameController.checkWin(gameBoard, turnsLeft, player1.name);
        CurrentPlayer.textContent = `${player2.name} turn`;
      } else {
        image.src = OMarkerPath;
        player2.play(cellXCoordinate, cellYCoordinate, gameBoard);
        gameController.checkWin(gameBoard, turnsLeft, player2.name);
        CurrentPlayer.textContent = `${player1.name} turn`;
      }
      image.classList.add("Marker");

      RoundNumber++;
    }
  });
});
