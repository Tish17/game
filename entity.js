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
  }
  
  draw(points) {
    if (this.step > points.length - 1) {
      this.count++;
      this.step = 0;
    }
    fill(this.color);
    noStroke();
    ctx.shadowBlur = 50;
    ctx.shadowColor = this.color;
    let pt = points[points.length - this.step - 1];
    this.x = pt.x - entitySize / 2;
    this.y = pt.y - entitySize / 2;
    rect(this.x, this.y, entitySize, entitySize, 3);
    this.step += this.velocity;
  }
  
  hasCollision(ballX, ballY) {
    let dx = abs(ballX - this.x) + entitySize;
    let dy = abs(ballY - this.y) + entitySize;
    return !(dx > ballRadius + entitySize / 2 || dy > ballRadius + entitySize / 2);
  }
  
  isCollisionInProcess() {
    return this.collisionInProcess;
  }
  
  setCollisionInProcess(collisionInProcess) {
    this.collisionInProcess = collisionInProcess;
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