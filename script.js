const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 60;
const ballRadius = 5;
const paddleSpeed = 4;
const ballSpeed = 2;
const aiSpeed = 0.05;



class Paddle {
  constructor(x, y, isHorizontal = false) {
    this.x = x;
    this.y = y;
    this.isHorizontal = isHorizontal;
    this.width = isHorizontal ? paddleHeight : paddleWidth;
    this.height = isHorizontal ? paddleWidth : paddleHeight;
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Ball {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = ballRadius;
    this.dx = ballSpeed;
    this.dy = ballSpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

const player = new Paddle(0, (canvas.height - paddleHeight) / 2);
const aiRight = new Paddle(canvas.width - paddleWidth, (canvas.height - paddleHeight) / 2);
const aiTop = new Paddle((canvas.width - paddleHeight) / 2, 0, true);
const aiBottom = new Paddle((canvas.width - paddleHeight) / 2, canvas.height - paddleWidth, true);

const ball = new Ball();




function aiMovement(aiPaddle, axis) {
  const target = axis === 'x' ? ball.x : ball.y;
  const diff = target - (aiPaddle[axis] + aiPaddle[axis === 'x' ? 'width' : 'height'] / 2);

  if (Math.abs(diff) <= paddleSpeed) {
    aiPaddle[axis] += diff;
  } else {
    aiPaddle[axis] += Math.sign(diff) * paddleSpeed * aiSpeed;
  }
}

function detectCollision(paddle, axis) {
  const isVerticalPaddle = axis === 'x';

  if (
    ball[axis] + ball.radius > paddle[axis] &&
    ball[axis] - ball.radius < paddle[axis] + paddle[axis === 'x' ? 'width' : 'height'] &&
    ball[isVerticalPaddle ? 'y' : 'x'] + ball.radius > paddle[isVerticalPaddle ? 'y' : 'x'] &&
    ball[isVerticalPaddle ? 'y' : 'x'] - ball.radius < paddle[isVerticalPaddle ? 'y' : 'x'] + paddle[isVerticalPaddle ? 'height' : 'width']
  ) {
    ball[isVerticalPaddle ? 'dx' : 'dy'] = -ball[isVerticalPaddle ? 'dx' : 'dy'];
  }
}

function detectCanvasCollision() {
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    player.y = Math.max(0, player.y - paddleSpeed);
  } else if (e.key === 'ArrowDown') {
    player.y = Math.min(canvas.height - paddleHeight, player.y + paddleSpeed);
  }
});

function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update AI paddle positions
  aiMovement(aiRight, 'y');
  aiMovement(aiTop, 'x');
  aiMovement(aiBottom, 'x');

  // Detect collisions
  detectCollision(player, 'x');
  detectCollision(aiRight, 'x');
  detectCollision(aiTop, 'y');
  detectCollision(aiBottom, 'y');
  detectCanvasCollision();

  // Update ball position
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Draw the paddles and ball
  player.draw();
  aiRight.draw();
  aiTop.draw();
  aiBottom.draw();
  ball.draw();

  // Continue the game loop
  requestAnimationFrame(gameLoop);
}

gameLoop();





