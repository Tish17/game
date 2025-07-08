let song;
let bgImage;
let bgLayer;
let waveform = [];
let step = 0;
let limit = 10;
let peakNumber = 1000;
let velocity = 0.06;
let jumpHeight = 15;
let points;
let ball;
let ballRadius;
let obstacle;
let boost;
let health;
let entitySize;
let ctx;

const Types = Object.freeze({
  OBSTACLE: 'OBSTACLE',
  BOOST: 'BOOST',
  HEALTH: 'HEALTH'
});

function preload() {
  song = loadSound('sound.mp3');
  bgImage = loadImage('space.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgLayer = createGraphics(width, height);
  bgLayer.image(bgImage, 0, 0, width, height);
  textSize(50);
  waveform = song.getPeaks(peakNumber);
  ball = new Ball();
  ballRadius = height * 0.06;
  obstacle = new Entity(color(255, 66, 66), Types.OBSTACLE);
  boost = new Entity(color(38, 49, 255), Types.BOOST);
  health = new Entity(color(0, 184, 43), Types.HEALTH);
  entitySize = height * 0.04;
  ctx = drawingContext;
}

function draw() {
  image(bgLayer, 0, 0);
  if (!song.isPlaying()) {
    drawTapToPlay();
    return;
  }
  if (step >= peakNumber) {
    step = 0;
  }
  addPoints();
  drawLine();
  drawHealth();
  ball.draw(lerpPeak(step + 2));
  let entity = drawEntity();
  checkCollision(entity);
  step += velocity;
}

function drawLine() {
  ctx.shadowBlur = 20;
  ctx.shadowColor = "violet";
  stroke("violet");
  strokeWeight(2);
  noFill();
  beginShape();
  for (let pt of points) {
    vertex(pt.x, pt.y);
  }
  endShape();
}

function drawEntity() {
  let entityCount = obstacle.getCount() + boost.getCount() + health.getCount() + 1;
  if (entityCount % 2 !== 0 && entityCount % 3 === 0) {
    boost.draw(points);
    return boost;
  } else if (entityCount % 2 === 0 && entityCount % 3 === 0) {
    health.draw(points);
    return health;
  } else {
    obstacle.draw(points);
    return obstacle;
  }
}

function checkCollision(entity) {
  let collision = entity.hasCollision(ball.getPoint().x, ball.getPoint().y);
  if (!entity.isCollisionInProcess() && collision) {
    if (entity.getType() === Types.OBSTACLE) {
      ball.setHealth(ball.getHealth() - 1);
    } else if (entity.getType() === Types.HEALTH) {
      ball.setHealth(ball.getHealth() + 1);
    } else if (entity.getType() === Types.BOOST) {
      ball.setPower(ball.getPower() + 1);
    }
    ball.setColor(entity.getColor());
    entity.setCollisionInProcess(true);
  } else if (entity.isCollisionInProcess() && !collision) {
    ball.setColor("white");
    entity.setCollisionInProcess(false);
  }
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
    let y = height / 2 * (1 - lerpPeak(step + i));
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
  ctx.shadowBlur = 0;
  text(ball.getHealth(), width / 2, height / 8);
}

function drawTapToPlay() {
  fill("white");
  noStroke();
  ctx.shadowBlur = 0;
  text("Tap to play", width / 2.5, height / 2);
}