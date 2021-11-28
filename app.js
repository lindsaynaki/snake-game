let gameState = {
    board: [],
    apple: [12, 14],
    gameInterval: null,
    snake: {
        body: [ [12, 5], [12, 4], [12, 3], [12, 2] ],
        nextDirection: [0, 1]
        },
    score: 0,
    highScore: 0
  }
  
const appElement = document.getElementById('app');
const boardElement = document.createElement('div');
const resetElement = document.createElement('div');
const scoreElement = document.createElement('div');
const highScoreElement = document.createElement('div');
const gameOverElement = document.createElement('div');
const startModalElement = document.createElement('div');
const startElement = document.createElement('button');
let interval = null;

function createSnake () {
  for (let i = 0; i < gameState.snake.body.length; i++) {
    const currentSnakeSegment = gameState.snake.body[i];
    let currentSegmentRowIdx = currentSnakeSegment[0];
    let currentSegmentColIdx = currentSnakeSegment[1];
    gameState.board[currentSegmentRowIdx][currentSegmentColIdx] = "snake";
  }
}

function createApple() {
  const applePosition = gameState.apple;
  gameState.board[applePosition[0]][applePosition[1]] = "apple";
}

function buildBoard() {
  gameState.board = [];
  for (let rowIdx = 0; rowIdx < 20; rowIdx++) {
    const row = [];
    for (let colIdx = 0; colIdx < 20; colIdx++) {
      row.push("");
    }
    gameState.board.push(row);
  }
  createSnake();
  createApple();
}

function bootStrap() {
    appElement.appendChild(boardElement);
    boardElement.setAttribute('id', 'board');
    appElement.appendChild(scoreElement).className = 'score';
    scoreElement.innerHTML = `🍎 ${gameState.score}`;
    appElement.appendChild(highScoreElement).className = 'high-score';
    highScoreElement.innerHTML = `🏆  ${gameState.highScore}`;
    appElement.appendChild(startModalElement).className = 'modal-container';
    startModalElement.innerText = "Press ⬅️ ➡️ ⬇️ ⬆️ to move snake 🐍";
    startModalElement.appendChild(startElement).className = 'start-button';
    startElement.innerText = "start game";
    buildBoard();
    renderBoard();
}

function renderBoard() {
  boardElement.innerHTML = "";
    for (let i = 0; i < gameState.board.length; i++) {
      for (let j = 0; j < gameState.board[i].length; j++) {
        let cellElement = document.createElement('div');
        if (gameState.board[i][j] === "snake") {
            const snakeHead = gameState.snake.body[0];
              if (i === snakeHead[0] && j === snakeHead[1]) {
                cellElement.classList.add('head');
              }
            cellElement.classList.add('snake');;
        } else if (gameState.board[i][j] === "apple") {
            cellElement.classList.add('apple');
        }
        cellElement.classList.add("cell");
        boardElement.appendChild(cellElement);
      }
    }
}

document.addEventListener("keydown", function(event) {
  const key = event.key; 
  if (gameState.gameInterval === null) {
    gameState.gameInterval = setInterval(tick, 160);
  }
  switch (key) { 
    case "ArrowLeft":
      if (gameState.snake.nextDirection[0] === 0 && gameState.snake.nextDirection[1] === 1) {
        return;
      }
      gameState.snake.nextDirection = [0, -1]
      break;
    case "ArrowRight":
      if (gameState.snake.nextDirection[0] === 0 && gameState.snake.nextDirection[1] === -1) {
        return;
      }
      gameState.snake.nextDirection = [0, 1]     
      break;
    case "ArrowUp":
      if (gameState.snake.nextDirection[0] === 1 && gameState.snake.nextDirection[1] === 0) {
        return;
      }
      gameState.snake.nextDirection = [-1, 0]
      break;
    case "ArrowDown":
      if (gameState.snake.nextDirection[0] === -1 && gameState.snake.nextDirection[1] === 0) {
        return;
      }
      gameState.snake.nextDirection = [1, 0]
      break;
  }
})

function moveSnake() {
  if (isGameOver()) {
    return;
  }
  const body = gameState.snake.body;
  const snakeHead = [body[0][0] + gameState.snake.nextDirection[0], body[0][1] + gameState.snake.nextDirection[1]];
  body.unshift(snakeHead);
  body.pop();
  if (body[0][0] === gameState.apple[0] && body[0][1] === gameState.apple[1]) {
    do { 
     gameState.apple = [Math.floor(Math.random() * gameState.board.length), Math.floor(Math.random() * gameState.board.length)];
    } while (gameState.board[gameState.apple[0]][gameState.apple[1]] === "snake");
    let snakeLength = gameState.snake.body.length;
    let snakeTail = gameState.snake.body[snakeLength - 1];
    gameState.snake.body.push(snakeTail);
    gameState.score += 1;
    scoreElement.innerHTML = `🍎 ${gameState.score}`;
    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score;
      highScoreElement.innerText = `🏆 ${gameState.highScore}`;
    }
  }
}

function isGameOver() {
  for (let i = 1; i < gameState.snake.body.length; i++) {
    if (
      (gameState.snake.body[0][0] === gameState.snake.body[i][0] && gameState.snake.body[0][1] === gameState.snake.body[i][1]) || 
      (gameState.snake.body[0][0] < 0 || gameState.snake.body[0][0] > 19 || gameState.snake.body[0][1] < 0 || gameState.snake.body[0][1] > 19)) {
        return true;
      }
  }
}

function renderGameOver (){
  startModalElement.classList.remove('inactive');
  startModalElement.innerText = '❌ game over ❌';
  startModalElement.style.color = 'red';
  startModalElement.style.fontWeight = 'bolder';
  startModalElement.appendChild(resetElement);
  resetElement.classList.add('play-again-button');
  resetElement.innerText = 'play again';
}

function tick() {
  moveSnake();
  if (isGameOver()) {
    renderGameOver();
    clearInterval(gameState.gameInterval);
  } else {
    buildBoard();
    renderBoard();
  }
}

function resetElementClick() {
  boardElement.innerHTML = "";
  gameOverElement.remove('game-over');
  let previousHighScore = gameState.highScore;
  gameState = {
    board: [],
    apple: [12, 14],
    gameInterval: null,
    snake: {
        body: [ [12, 5], [12, 4], [12, 3], [12, 2] ],
        nextDirection: [0, 1]
      },
    score: 0,
    highScore: previousHighScore
  }
  scoreElement.innerText = `🍎 ${gameState.score}`;
  highScoreElement.innerText = `🏆  ${gameState.highScore}`;
  startModalElement.classList.add('inactive');
  buildBoard();
  renderBoard();
}

resetElement.addEventListener('click', resetElementClick);

function startElementClick () {
  startModalElement.classList.add('inactive');
}

startElement.addEventListener('click', startElementClick);

bootStrap();
