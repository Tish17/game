let song;
let waveform = [];
let step = 0;
let limit = 10;
let peakNumber = 1000;
let jumpOffset = 0;
let jumpVelocity = 0;
let gravity = 0.8;
let isJumping = false;
let velocity = 0.06;
let points;
let obstacleStep = 0;
let obstacleVelocity = 5;
let ballRadius = 25;
let obstacleSide = 20;
let obstacleDiagonal;

function preload() {
  song = loadSound('sound.mp3');
}

function setup() {
  createCanvas(600, 500);
  waveform = song.getPeaks(peakNumber);
}

function draw() {
  background("black");
  stroke("white");
  noFill();
  if (step >= peakNumber) {
    step = 0;
  }
  addPoints();
  beginShape();
  for (let pt of points) {
    vertex(pt.x, pt.y);
  }
  endShape();
  drawBall();
  drawObstacle();
  step += velocity;
}

function lerpPeak(index) {
  let i = floor(index);
  let frac = index - i;
  let a = waveform[i] || 0;
  let b = waveform[i + 1] || 0;
  return a + (b - a) * frac;
}

function mousePressed() {
  if (!song.isPlaying()) {
    song.play();
  }
  if (!isJumping) {
    jumpVelocity = -12;
    isJumping = true;
  }
}

function jump() {
  jumpVelocity += gravity;
  jumpOffset += jumpVelocity;
  if (jumpOffset > 0) {
    jumpOffset = 0;
    jumpVelocity = 0;
    isJumping = false;
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

function drawBall() {
  fill("white");
  let x0 = map(2, 1, limit - 2, 0, width);
  let y0 = height / 2 - lerpPeak(step + 2) * height / 2;
  jump();
  circle(x0, y0 + jumpOffset, ballRadius);
}

function drawObstacle() {
  if (obstacleStep > points.length - 1) {
    obstacleStep = 0;
  }
  fill("red");
  noStroke();
  let pt = points[points.length - obstacleStep - 1];
  square(pt.x - obstacleSide / 2, pt.y - obstacleSide / 2, obstacleSide);
  obstacleStep += obstacleVelocity;
}
