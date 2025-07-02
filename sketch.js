let song;
let waveform = [];
let step = 0;
let limit = 10;
let peakNumber = 1000;
let velocity = 0.06;
let points;
let ball;
let obstacle;

function preload() {
  song = loadSound('sound2.mp3');
}

function setup() {
  createCanvas(600, 500);
  textSize(32);
  waveform = song.getPeaks(peakNumber);
  ball = new Ball();
  obstacle = new Entity(0, 20, "red", ball.getRadius(), 5, false);
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
  ball.draw(lerpPeak(step + 2));
  obstacle.draw(points);
  let collision = obstacle.hasCollision(ball.getPoint().x, ball.getPoint().y);
  if (!obstacle.isCollisionInProcess() && collision) {
    ball.setHealth(ball.getHealth() - 1);
    ball.setColor("red");
    obstacle.setCollisionInProcess(true);
  } else if (obstacle.isCollisionInProcess() && !collision) {
    ball.setColor("white");
    obstacle.setCollisionInProcess(false);
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

function drawHealth() {
  fill("white");
  noStroke();
  text(ball.getHealth(), width / 2, height / 8);
}

function drawTapToPlay() {
  fill("white");
  noStroke();
  text("Tap to play", width / 3, height / 2);
}