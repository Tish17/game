let song;
let waveform = [];
let step = 0;
let limit = 10;
let peakNumber = 1000;
let velocity = 0.06;
let points;
let obstacleStep = 0;
let obstacleVelocity = 5;
let obstacleSide = 20;
let obstacleDiagonal;
let health = 10;
let collisionInProcess = false;
let ballColor = "white";
let ball;
let ballRadius = 25;

function preload() {
  song = loadSound('sound.mp3');
}

function setup() {
  createCanvas(600, 500);
  textSize(32);
  waveform = song.getPeaks(peakNumber);
  ball = new Ball();
}

function draw() {
  background("black");
  stroke("white");
  noFill();
  if (!song.isPlaying()) {
    drawTapToPlay();
    return;
  }
  if (step >= peakNumber) {
    step = 0;
  }
  addPoints();
  beginShape();
  for (let pt of points) {
    vertex(pt.x, pt.y);
  }
  endShape();
  drawHealth();
  let circleXY = ball.draw(ballColor, lerpPeak(step + 2));
  let squareXY = drawObstacle();
  let collision = hasCollision(circleXY.x, circleXY.y, squareXY.x, squareXY.y);
  if (!collisionInProcess && collision) {
    health--;
    collisionInProcess = true;
    ballColor = "red";
  } else if (collisionInProcess && !collision) {
    collisionInProcess = false;
    ballColor = "white";
  }
  step += velocity;
}

function mousePressed() {
  if (!song.isPlaying()) {
    song.play();
  }
  if (!ball.isJumping()) {
    ball.updateJumping();
  }
}

function addPoints() {
  points = [];
  let controlPoints = [];
  for (let i = 0; i < limit; i++) {
    let x = map(i, 1, limit - 2, 0, width);
    let y = height / 2 - lerpPeak(step + i) * height / 2;
    controlPoints.push({ x, y });
  }
  for (let i = 1; i < controlPoints.length - 2; i++) {
    let p0 = controlPoints[i - 1];
    let p1 = controlPoints[i];
    let p2 = controlPoints[i + 1];
    let p3 = controlPoints[i + 2];

    for (let t = 0; t <= 1; t += 0.01) {
      let x = curvePoint(p0.x, p1.x, p2.x, p3.x, t);
      let y = curvePoint(p0.y, p1.y, p2.y, p3.y, t);
      points.push({ x, y });
    }
  }
}

function lerpPeak(index) {
  let i = floor(index);
  let frac = index - i;
  let a = waveform[i] || 0;
  let b = waveform[i + 1] || 0;
  return a + (b - a) * frac;
}

function drawObstacle() {
  if (obstacleStep > points.length - 1) {
    obstacleStep = 0;
  }
  fill("red");
  noStroke();
  let pt = points[points.length - obstacleStep - 1];
  let x = pt.x - obstacleSide / 2;
  let y = pt.y - obstacleSide / 2;
  square(x, y, obstacleSide);
  obstacleStep += obstacleVelocity;
  return {x, y};
}

function hasCollision(circleX, circleY, squareX, squareY) {
  let dx = abs(circleX - squareX) + obstacleSide;
  let dy = abs(circleY - squareY) + obstacleSide;
  if (dx > ballRadius + obstacleSide / 2 || dy > ballRadius + obstacleSide / 2) {
    return false;
  }
  return true;
}

function drawHealth() {
  fill("white");
  noStroke();
  text(health, width / 2, height / 8);
}

function drawTapToPlay() {
  fill("white");
  noStroke();
  text("Tap to play", width / 3, height / 2);
}