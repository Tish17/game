class Entity {
  constructor(step, color, radius, velocity, collisionInProcess, type) {
    this.entityStep = step;
    this.size = height * 0.04;
    this.color = color;
    this.radius = radius;
    this.velocity = velocity;
    this.collisionInProcess = collisionInProcess;
    this.x = 0;
    this.y = 0;
    this.count = 0;
    this.type = type;
  }
  
  draw(points) {
    if (this.entityStep > points.length - 1) {
      this.count++;
      this.entityStep = 0;
    }
    fill(this.color);
    noStroke();
    ctx.shadowBlur = 50;
    ctx.shadowColor = this.color;
    let pt = points[points.length - this.entityStep - 1];
    this.x = pt.x - this.size / 2;
    this.y = pt.y - this.size / 2;
    rect(this.x, this.y, this.size, this.size, 3);
    this.entityStep += this.velocity;
  }
  
  hasCollision(ballX, ballY) {
    let dx = abs(ballX - this.x) + this.size;
    let dy = abs(ballY - this.y) + this.size;
    if (dx > this.radius + this.size / 2 || dy > this.radius + this.size / 2) {
      return false;
    }
    return true;
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