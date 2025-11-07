let song;
let bgImage;
let bgLayer;
let waveform = [];
let step = 0;
let limit = 10;
let peakNumber = 1000;
let velocity = 3.6;
let jumpHeight = 900;
let points;
let ball;
let ballColor = "white";
let ballRadius;
let obstacle;
let boost;
let health;
let entitySize;
let entityOffset;
let ctx;
let gameStarted = false;
let startSuperMode;
let endSuperMode = 0;
let superModeTimeout = 10;
let superBorderSize = 5;
const collisionMargin = 15;
const amplitude = 0.5;

const Types = Object.freeze({
  OBSTACLE: 'OBSTACLE',
  BOOST: 'BOOST',
  HEALTH: 'HEALTH'
});

function preload() {
  bgImage = loadImage('space.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  document.body.style.overflow = 'hidden';
  bgLayer = createGraphics(width, height);
  bgLayer.image(bgImage, 0, 0, width, height);
  textSize(50);
  ball = new Ball();
  ballRadius = height * 0.06;
  obstacle = new Entity(color(255, 66, 66), Types.OBSTACLE);
  boost = new Entity(color(38, 49, 255), Types.BOOST);
  health = new Entity(color(0, 184, 43), Types.HEALTH);
  entitySize = height * 0.04;
  entityOffset = jumpHeight + ballRadius * 2;
  ctx = drawingContext;
  fileInput = createFileInput(handleFile);
  fileInput.position(width / 3, height / 2.5);
  fileInput.style('background-color', 'white');
  fileInput.style('height', '50px');
  fileInput.style('width', '400px');
  fileInput.style('padding', '15px 25px');
  fileInput.style('color', 'black');
  fileInput.style('border', 'none');
  fileInput.style('border-radius', '10px');
  fileInput.style('font-size', '24px');
}

function draw() {
  image(bgLayer, 0, 0);
  if (waveform.length === 0) {
    return;
  }
  startSuperMode = new Date().getTime();
  if (waveform.length > 0 && !song.isPlaying() && ball.getHealth() === 10) {
    drawText("Tap to play");
    return;
  } else if (ball.getHealth() < 1) {
    drawText("GAME OVER");
    song.stop();
    return;
  } else if (waveform.length > 0 && !song.isPlaying() && gameStarted) {
    drawText("YOU WON!!!");
    return;
  }
  if (step >= peakNumber) {
    step = 0;
  }
  let velocityStep = velocity * deltaTime / 1000;
  if (frameCount % 60 === 0) {
    obstacle.increaseVelocity(velocityStep);
    boost.increaseVelocity(velocityStep);
    health.increaseVelocity(velocityStep);
  }
  checkSuperMode();
  addPoints();
  drawLine();
  drawState(health, width * 0.9);
  drawState(boost, width * 0.1);
  ball.draw(lerpPeak(step + 2));
  let entity = drawEntity();
  if (ball.superMode()) {
    drawSuperBorder();
  } else {
    checkCollision(entity);
  }
  step += velocityStep;
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

function checkSuperMode() {
  if (endSuperMode > 0 && startSuperMode > endSuperMode) {
    ball.setPower(0);
    ball.setColor(ballColor);
    endSuperMode = 0;
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
      if (ball.superMode()) {
        endSuperMode = startSuperMode + superModeTimeout * 1000;
      }
    }
    ball.setColor(entity.getColor());
    entity.setCollisionInProcess(true);
  } else if (entity.isCollisionInProcess() && !collision) {
    ball.setColor(ballColor);
    entity.setCollisionInProcess(false);
  }
}

function mousePressed() {
  if (waveform.length > 0 && !song.isPlaying() && !gameStarted) {
    song.play();
    gameStarted = true;
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
    let y = height / 2 * (1 - amplitude * lerpPeak(step + i));
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

function drawState(entity, x) {
  ctx.shadowBlur = 40;
  ctx.shadowColor = entity.getColor();
  fill(entity.getColor());
  noStroke();
  text(entity.getType() === 'HEALTH' ? ball.getHealth() : ball.getPower(), x, height / 8);
}

function drawText(textToDraw) {
  fill("white");
  noStroke();
  ctx.shadowBlur = 0;
  text(textToDraw, width / 2.5, height / 2);
}

function drawSuperBorder() {
  let superColor = ball.getSuperColor();
  noStroke();
  fill(superColor);
  ctx.shadowBlur = 100;
  ctx.shadowColor = superColor;
  rect(0, 0, width, superBorderSize);
  rect(0, height - superBorderSize, width, superBorderSize);
  rect(0, 0, superBorderSize, height);
  rect(width - superBorderSize, 0, superBorderSize, height);
}

function handleFile(file) {
  if (file.name.toLowerCase().endsWith('.mp3')) {
    song = loadSound(file.data, () => {
      waveform = song.getPeaks(peakNumber);
      fileInput.remove();
    });
  } else {
    alert('Only mp3 files are supported');
  }
}