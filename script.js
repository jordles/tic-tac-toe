/* 
OOP Pillars (EAIP or PAIN) Checklist:

1. E(N)capsulation -  TicTacToe class groups our properties and methods for easier management of data. 

2. Abstraction -  Various properties and methods are private, to ensure players cannot cheat or manipulate the game in anyway. Some examples includes the player class which users are not allowed to alter programmatically, but only through interacting with the UI given, and important properties like setting who is the current player or the board size or the winner of the game are also private. It is also used to hide unnecessary information and expose only the necessary information.

3. Inheritance - The TicTacToe class inherits from the Game class. 

4. Polymorphism - Since we don't know how a certain game will run, Game class' methods are left empty, we will override them in its child classes.
 
Known issues: 
emojis/symbols can go past the 1 character limit for tilePieces. I have tried to use an input event listener instead but that doesn't work, including cases with copy and paste.  
*/

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
  #board = Array(9).fill({ tilePiece: "", color: "" }); //color accounts for same tilePieces but different colors
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
        if (this.isGameOver || this.#board[tileIndex].tilePiece !== "") return;
        this.makeMove(tileIndex); //mark the board
        this.checkWinner(); //check if we won
      }
    });
  }

  makeMove(tileIndex) {
    if (this.#board[tileIndex].tilePiece === "") {
      this.#board[tileIndex] = {
        tilePiece: this.#currentPlayer.tilePiece,
        color: this.#currentPlayer.color,
      };
      this.updateUI(tileIndex); //update tile on our board on the DOM
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
      console.log(this.#board);
      if (
        this.#board[a].tilePiece !== "" &&
        this.#board[a].tilePiece === this.#board[b].tilePiece &&
        this.#board[b].tilePiece === this.#board[c].tilePiece &&
        this.#board[a].color === this.#board[b].color &&
        this.#board[b].color === this.#board[c].color
      ) {
        this.setWinner(this.#board[a].tilePiece);
        this.endGame();
        return;
      }
    }

    if (this.#board.every((tile) => tile.tilePiece !== "")) {
      this.endGame();
    }
  }

  updateUI(tileIndex) {
    const tile = document.querySelector(`[data-tile="${tileIndex}"]`);
    tile.textContent = this.#board[tileIndex].tilePiece;

    if (this.#board[tileIndex]) {
      tile.style.textShadow = `0 0 0 ${this.#board[tileIndex].color}`; /* `0 0 0 ${this.#currentPlayer.color}`; */
      tile.style.color = this.#board[tileIndex].color === "rgb(0, 0, 0)" || this.#board[tileIndex].color === "black" ? "black" : "transparent";
    }
  }

  endGame() {
    this.setIsGameOver(true);
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
  resetUIBoard() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      const tileIndex = tile.dataset.tile;
      tile.textContent = this.#board[tileIndex].tilePiece;
    });
  }

  resetGame() {
    this.grabPlayers(); //feel free to customize your name/tile piece/color before restarting the game.
    this.#board = Array(9).fill({ tilePiece: "", color: "" });
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
    this.resetUIBoard();
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
      ? `<span class="flip">🎉</span> ${name} ${tilePiece} <span style="color: #D4AF37;">Wins!</span> 🎉`
      : "It's a Tie!";
  }
}

// Create a new instance of the TicTacToe class
const game = new TicTacToe();