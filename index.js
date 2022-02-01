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

function Player(name, markerName) {
  let marker = document.createElement("img");
  marker.src = `./assets/${markerName}.jpg`;
  marker.classList.add("Marker");
  let returnedPlayer = { name, marker };
  Object.assign(returnedPlayer, playerActions);
  return returnedPlayer;
}

let player1 = Player("player 1", "x");
let player2 = Player("player 2", "o");

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
  let roundNumber = 1;
  let winOrDraw = false;
  let turnsLeft = 9;
  let currentMarker = player1.marker.cloneNode(true);

  let ResultDisplay = document.querySelector(".ResultDisplay");

  function checkWinOrDrawOnRows(gameBoard) {
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

  function checkWinOrDrawOnAxis(gameBoard) {
    let transposedgameBoard = TransposeGameBoard(gameBoard); //make columns rows

    if (
      checkWinOrDrawOnRows(gameBoard) ||
      checkWinOrDrawOnRows(transposedgameBoard)
    ) {
      //check both rows(normal Board) and columns (transposed board)
      return true;
    }
    return false;
  }

  function checkWinOrDrawOnDiagonal(gameBoard) {
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

  function checkWinOrDraw(gameBoard, playerName) {
    turnsLeft--;
    if (
      checkWinOrDrawOnDiagonal(gameBoard) ||
      checkWinOrDrawOnAxis(gameBoard)
    ) {
      DisplayResult(true, playerName);
    } else if (turnsLeft == 0) {
      DisplayResult(false, playerName);
    }
  }

  function switchPlayer(player) {
    CurrentPlayerNameDisplay.textContent = `${player.name} turn`;
    gameController.currentMarker = player.marker.cloneNode(true);
  }
  function DisplayResult(winOrDraw, playerName) {
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
    checkWinOrDraw,
    switchPlayer,
    roundNumber,
    winOrDraw,
    currentMarker,
  };
})();

let gameBoard = gameBoardCreator.getGameBoard();

let CurrentPlayerNameDisplay = document.querySelector(".CurrentPlayer");
CurrentPlayerNameDisplay.textContent = `${player1.name} turn`;

let reloadButton = document.querySelector(".ReloadBtn");
reloadButton.addEventListener("click", () => {
  location.reload();
});

let gameBoardCells = loadElementsIntoArray(".GameBoardCellDisplay");
gameBoardCells.forEach((cell) => {
  cell.addEventListener("click", (event) => {
    if (
      !event.target.classList.contains("Marker") &&
      !gameController.winOrDraw
    ) {
      [cellXCoordinate, cellYCoordinate] = [
        Number.parseInt(cell.classList[1][4]), //Cell 00 (0,0),Cell 00 (0,1)
        Number.parseInt(cell.classList[1][5]),
      ];
      if (gameController.roundNumber % 2 != 0) {
        event.target.append(gameController.currentMarker);
        player1.play(cellXCoordinate, cellYCoordinate, gameBoard);
        gameController.checkWinOrDraw(gameBoard, player1.name);
        gameController.switchPlayer(player2);
      } else {
        event.target.append(gameController.currentMarker);
        player2.play(cellXCoordinate, cellYCoordinate, gameBoard);
        gameController.checkWinOrDraw(gameBoard, player2.name);
        gameController.switchPlayer(player1);
      }
      gameController.roundNumber++;
    }
  });
});
