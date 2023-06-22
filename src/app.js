import * as PIXI from 'pixi.js';
import io from 'socket.io-client';

const app = new PIXI.Application({ width: 800, height: 400 });
document.body.appendChild(app.view);

const socket = io('http://localhost:3000/');

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
  // console.log("Updating game state")
  updateGame(gameState);
});

let game ={
  ballGraphics: undefined,
  playerPaddleGraphics: undefined, 
  opponentPaddleGraphics: undefined,
};

function updateGame(gameState) {
  const { player1, player2, ball, wallTop, wallBottom } = gameState;
  if (!game.playerPaddleGraphics) {
    game.playerPaddleGraphics = createPaddle(playerNumber === 1 ? player1 : player2);
    app.stage.addChild(game.playerPaddleGraphics);
  }
  if (!game.opponentPaddleGraphics) {
    game.opponentPaddleGraphics =  createPaddle(playerNumber === 1 ? player2 : player1);
    app.stage.addChild(game.opponentPaddleGraphics);
  }
  updatePaddlePosition(game.playerPaddleGraphics, playerNumber === 1 ? player1 : player2);
  updatePaddlePosition(game.opponentPaddleGraphics, playerNumber === 1 ? player2 : player1);

  // Update ball position  
  if (!game.ballGraphics) {
    console.log("Creating ball for first time");
    game.ballGraphics = createBall(ball);
    app.stage.addChild(game.ballGraphics);
  } 
  updateBallPosition(ball);
  console.log({pos: game.ballGraphics.position})
}

function createPaddle(player) {
  const paddle = new PIXI.Graphics();
  paddle.beginFill(0xffffff);
  paddle.drawRect(0, 0, 10, 80);
  paddle.endFill();
  paddle.x = player.position.x;
  paddle.y = player.position.y;
  return paddle;
}

function updatePaddlePosition(paddle, player) {
  paddle.x = player.position.x;
  paddle.y = player.position.y;
}
function updateBallPosition(ball) {
  game.ballGraphics.x = ball.position.x;
  game.ballGraphics.y = ball.position.y;
}

function createBall(ball) {
  const ballGraphics = new PIXI.Graphics();
  ballGraphics.beginFill(0xffffff);
  ballGraphics.drawCircle(100, 200, 10);
  ballGraphics.endFill();
  return ballGraphics;
}
