class Entity {
  constructor(color, type) {
    this.step = 0;
    this.color = color;
    this.velocity = 5;
    this.collisionInProcess = false;
    this.x = 0;
    this.y = 0;
    this.count = 0;
    this.type = type;
    this.offset = 0;
  }
  
  draw(points) {
    if (this.step > points.length - 1) {
      this.count++;
      this.step = 0;
      let minOffset = Math.abs(Math.min(...points.map(pt => pt.y)) - entitySize / 2);
      this.offset = Math.random() * Math.min(minOffset, entityOffset);
    } else {
      fill(this.color);
      noStroke();
      let pt = points[points.length - floor(this.step) - 1];
      this.x = pt.x - entitySize / 2;
      this.y = pt.y - entitySize / 2 - this.offset;
      rect(this.x, this.y, entitySize, entitySize, 3);
      this.step += this.velocity;
    }
  }
  
  hasCollision(ballX, ballY) {
    let closestX = Math.max(this.x, Math.min(ballX, this.x + entitySize));
    let closestY = Math.max(this.y, Math.min(ballY, this.y + entitySize));
    let dx = ballX - closestX;
    let dy = ballY - closestY;
    return (dx * dx + dy * dy) < Math.pow(ballRadius - collisionMargin, 2);
  }
  
  isCollisionInProcess() {
    return this.collisionInProcess;
  }
  
  setCollisionInProcess(collisionInProcess) {
    this.collisionInProcess = collisionInProcess;
  }
  
  increaseVelocity(velocityStep) {
    this.velocity += velocityStep;
  }

  getCount() {
    return this.count;
  }

  getColor() {
    return this.color;
  }

  getType() {
    return this.type;
  }
}