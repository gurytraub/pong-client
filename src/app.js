import * as PIXI from 'pixi.js';
import io from 'socket.io-client';

const app = new PIXI.Application({ width: 800, height: 400 });
document.body.appendChild(app.view);

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

let playerNumber;
let playerPaddle;
let opponentPaddle;

socket.on('player', number => {
  playerNumber = number;
  console.log(`You are Player ${playerNumber}`);
});

socket.on('start', () => {
  console.log('Game started!');
});

socket.on('message', message => {
  console.log(message);
});

socket.on('gameState', gameState => {
  console.log("Updating game state")
  updateGame(gameState);
});

function updateGame(gameState) {
  const { player1, player2, ball } = gameState;

  if (!playerPaddle) {
    playerPaddle = createPaddle(playerNumber === 1 ? player1 : player2);
    app.stage.addChild(playerPaddle);
  } else {
    updatePaddlePosition(playerPaddle, playerNumber === 1 ? player1 : player2);
  }

  if (!opponentPaddle && playerNumber === 2) {
    opponentPaddle = createPaddle(player2);
    app.stage.addChild(opponentPaddle);
  } else if (opponentPaddle && playerNumber === 1) {
    app.stage.removeChild(opponentPaddle);
    opponentPaddle = null;
  }

  // Update ball position
  if (ball) {
    console.log("Creating ball for first time");
    const ballGraphics = createBall(ball);
    app.stage.addChild(ballGraphics);
  }
}

function createPaddle(player) {
  const paddle = new PIXI.Graphics();
  paddle.beginFill(0xffffff);
  paddle.drawRect(0, 0, 10, 80);
  paddle.endFill();
  paddle.x = player.position.x - 5;
  paddle.y = player.position.y - 40;
  return paddle;
}

function updatePaddlePosition(paddle, player) {
  paddle.x = player.position.x - 5;
  paddle.y = player.position.y - 40;
}

function createBall(ball) {
  const ballGraphics = new PIXI.Graphics();
  ballGraphics.beginFill(0xffffff);
  ballGraphics.drawCircle(0, 0, 10);
  ballGraphics.endFill();
  ballGraphics.x = ball.position.x;
  ballGraphics.y = ball.position.y;
  return ballGraphics;
}
