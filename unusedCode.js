/* class Player {
  constructor(name, tilePiece, color) {
    this.name = name;
    this.tilePiece = tilePiece;
    this.color = color;
  }
}

class TicTacToe extends Player {
  constructor() {
    super();
    this.board = Array(9).fill("");
    this.currentPlayerIndex = 0;
    this.currentPlayer = null;
    this.players = [];
    this.winner = null;
    this.isGameOver = false;

    document.querySelector('#restart').addEventListener('click', (e) => {
      restart.classList.add("disabled");
      e.target.innerText === 'Restart' ? this.resetGame() : this.initGame();
    });
  }

  switchPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.currentPlayer = this.players[this.currentPlayerIndex];
  }

  initGame() {
    const player1 = new Player("Alice", "X", "red");
    const player2 = new Player("Bob", "O", "blue");
    this.players = [player1, player2];
    this.currentPlayer = this.players[this.currentPlayerIndex]; */

  /* function clearSpan(element) {
    element.innerHTML = "";
  } */



/* 
//#board with only one element in the array
updateUI(tileIndex) {
    const tile = document.querySelector(`[data-tile="${tileIndex}"]`);
    tile.textContent = this.#board[tileIndex];

    if (this.#board[tileIndex]) {
      tile.style.textShadow = `0 0 0 ${this.#currentPlayer.color}`;

      if (
        this.#board[tileIndex] === this.player1.tilePiece &&
        (this.player1.color === "rgb(0, 0, 0)" || this.player1.color === "black")
      ) {
        tile.style.color = "black";
      } 
      else if (
        this.#board[tileIndex] === this.player2.tilePiece &&
        (this.player2.color === "rgb(0, 0, 0)" || this.player2.color === "black")
      ) {
        tile.style.color = "black";
      } 
      else {
        tile.style.color = "transparent";
      }
    }
  } */
//working draft before major changes...

/* -------------------------------------------------------------------------- */
/*                                 PAGE SCRIPT                                */
/* -------------------------------------------------------------------------- */

const restart = document.querySelector("#restart");
const message = document.querySelector("#message");
const span = document.querySelectorAll(".player span");
const colorInputs = document.querySelectorAll("input[type='color']");
const board = document.querySelector("#board");

colorInputs.forEach((colorInput) => {
  colorInput.addEventListener("input", (e) => {
    colorInput.parentElement.style.backgroundColor = e.target.value;
  });
});

span.forEach((span) => {
  span.setAttribute("contenteditable", "true");
});

function checkLength(event) {
  const maxChars = 1;
  const target = event.target;
  currentChars = target.textContent.length;
  if (currentChars >= maxChars) {
    /* event.preventDefault(); */ //since we use keypress event, we prevent its default behavior.
    target.textContent = target.textContent.slice(0, -1);
  }
}

/* -------------------------------------------------------------------------- */
/*                             TIC TAC TOE SCRIPT                             */
/* -------------------------------------------------------------------------- */
class Player {
  #name;
  #tilePiece;
  #color;

  constructor(name, tilePiece, color) {
    this.#name = name;
    this.#tilePiece = tilePiece;
    this.#color = color;
  }

  get name() {
    return this.#name;
  }

  get tilePiece() {
    return this.#tilePiece;
  }

  get color() {
    return this.#color;
  }
}

class Game {
  #isGameOver = false;
  #winner = null;

  get isGameOver() {
    return this.#isGameOver;
  }

  get winner() {
    return this.#winner;
  }

  startGame() {
    throw new Error("start() method not implemented");
  }

  endGame() {
    this.#isGameOver = true;
  }

  resetGame() {
    throw new Error("restart() method not implemented");
  }

  setWinner(winner) {
    this.#winner = winner;
  }

  resetWinner() {
    this.#winner = null;
  }

  setIsGameOver(isGameOver) {
    this.#isGameOver = isGameOver;
  }
}

class TicTacToe extends Game {
  #board = Array(9).fill("");
  #currentPlayer = null;
  #startingPlayer = 1;
  player1 = null;
  player2 = null;

  constructor() {
    super(); // Call the parent class's constructor to initialize isGameOver and winner

    document.querySelector("#restart").addEventListener("click", (e) => {
      restart.classList.add("disabled");
      e.target.innerText === "Restart" ? this.resetGame() : this.startGame();
    });
  }

  /* ------------------------------------------------------------------------ */
  /*                                 FUNCTIONS                                */
  /* ------------------------------------------------------------------------ */
  startGame() {
    this.grabPlayers();
    this.#currentPlayer =
      this.#startingPlayer === 1 ? this.player1 : this.player2;
    restart.innerText = "Restart";
    this.updateHoverStyles();

    this.updateMessage(
      this.#currentPlayer.name,
      this.#currentPlayer.tilePiece,
      this.#currentPlayer.color
    );

    board.addEventListener("click", (event) => {
      if (event.target.matches(".tile")) {
        const tileIndex = event.target.dataset.tile;
        if (this.isGameOver || this.#board[tileIndex] !== "") return;
        this.makeMove(tileIndex); //mark the board
        this.checkWinner(); //check if we won
        this.updateUI(); //update our board on the DOM
      }
    });
  }

  makeMove(tileIndex) {
    if (this.#board[tileIndex] === "") {
      this.#board[tileIndex] = this.#currentPlayer.tilePiece;

      this.switchPlayer();
      this.updateHoverStyles();

      this.updateMessage(
        this.#currentPlayer.name,
        this.#currentPlayer.tilePiece,
        this.#currentPlayer.color
      );
    }
  }

  checkWinner() {
    const winningCombinations = [
      [0, 1, 2], //horizontal
      [3, 4, 5], //horizontal
      [6, 7, 8], //horizontal
      [0, 3, 6], //vertical
      [1, 4, 7], //vertical
      [2, 5, 8], //vertical
      [0, 4, 8], //diagonal
      [2, 4, 6], //diagonal
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (
        this.#board[a] !== "" &&
        this.#board[a] === this.#board[b] &&
        this.#board[b] === this.#board[c]
      ) {
        this.setWinner(this.#board[a]);
        this.endGame();
        break;
      }
    }

    if (this.#board.every((tile) => tile !== "")) {
      this.endGame();
    }
  }

  updateUI() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      const tileIndex = tile.dataset.tile;
      tile.textContent = this.#board[tileIndex];

      if (this.#board[tileIndex]) {
        let playerColor;
        console.log(this.player1.tilePiece === this.player1.tilePiece);
        if (this.#board[tileIndex] === this.player1.tilePiece) {
          playerColor = this.player1.color;
        } else if (this.#board[tileIndex] === this.player2.tilePiece) {
          playerColor = this.player2.color;
        }
        tile.style.textShadow = `0 0 0 ${playerColor}`;


        if (
          this.#board[tileIndex] === this.player1.tilePiece &&
          (this.player1.color === "rgb(0, 0, 0)" || this.player1.color === "black")
        ) {
          tile.style.color = "black";
        } 
        else if (
          this.#board[tileIndex] === this.player2.tilePiece &&
          (this.player2.color === "rgb(0, 0, 0)" || this.player2.color === "black")
        ) {
          tile.style.color = "black";
        } 
        else {
          tile.style.color = "transparent";
        }
      }
    });

    if (this.isGameOver) {
      this.updateHoverStyles("");
      restart.classList.remove("disabled");
      this.switchPlayer(); //because i switched the player early in preparation for the next player's colors and tile piece, I have to switch back since the game is over and i need to grab the correct color.
      const color = this.winner ? this.#currentPlayer.color : "black";
      this.updateMessage(
        this.#currentPlayer.name,
        this.#currentPlayer.tilePiece,
        color
      );
    }
  }

  resetGame() {
    this.grabPlayers(); //feel free to customize your name/tile piece/color before restarting the game.
    this.#board = Array(9).fill("");
    this.#startingPlayer = this.#startingPlayer === 2 ? 1 : 2;
    this.#currentPlayer =
      this.#startingPlayer === 1 ? this.player1 : this.player2;

    this.resetWinner();
    this.setIsGameOver(false);

    this.updateHoverStyles();
    this.updateMessage(
      this.#currentPlayer.name,
      this.#currentPlayer.tilePiece,
      this.#currentPlayer.color
    );
    this.updateUI();
  }

  /* ------------------------------------------------------------------------ */
  /*                             HELPER FUNCTIONS                             */
  /* ------------------------------------------------------------------------ */
  switchPlayer() {
    this.#currentPlayer =
      this.#currentPlayer === this.player2 ? this.player1 : this.player2;
  }

  grabPlayers() {
    this.player1 = new Player(
      document.querySelector(".player.one .name").innerText,
      document.querySelector(".player.one .tilePiece").innerText,
      getComputedStyle(document.querySelector(".player.one")).backgroundColor
    );
    this.player2 = new Player(
      document.querySelector(".player.two .name").innerText,
      document.querySelector(".player.two .tilePiece").innerText,
      getComputedStyle(document.querySelector(".player.two")).backgroundColor
    );
  }

  updateHoverStyles(
    content = `"${this.#currentPlayer.tilePiece}"`,
    color = `${this.#currentPlayer.color}`
  ) {
    document.documentElement.style.setProperty("--hover-content", content);
    document.documentElement.style.setProperty("--hover-shadow", color);
    if (
      this.#currentPlayer.color === "rgb(0, 0, 0)" ||
      this.#currentPlayer.color === "black"
    ) {
      document.documentElement.style.setProperty("--hover-color", "black");
    } else {
      document.documentElement.style.setProperty(
        "--hover-color",
        "transparent"
      );
    }
  }

  updateMessage(name, tilePiece, color) {
    message.style.color = color;
    message.innerHTML = !this.isGameOver
      ? `${name} ${tilePiece}'s Turn`
      : this.winner
      ? `${name} ${tilePiece} <span style="color: #D4AF37;">Wins!</span> 🎉🎉`
      : "It's a Tie!";
  }
}

// Create a new instance of the TicTacToe class
const game = new TicTacToe();