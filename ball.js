class Ball {
  constructor() {
    this.offset = 0;
    this.velocity = 0;
    this.gravity = 0.8;
    this.jumping = false;
    this.color = "white";
    this.health = 10;
    this.power = 0;
    this.x = 0;
    this.y = 0;
  }
  
  draw(stepY) {
    this.x = map(2, 1, limit - 2, 0, width);
    this.y = height / 2 * (1 - stepY);
    this.jump();
    this.y += this.offset;
    let superColor = this.superMode() ? this.getSuperColor() : this.color;
    fill(superColor);
    noStroke();
    ctx.shadowBlur = 100;
    ctx.shadowColor = superColor;
    circle(this.x, this.y, ballRadius);
  }
  
  jump() {
    this.velocity += this.gravity;
    this.offset += this.velocity;
    if (this.offset > 0) {
      this.offset = 0;
      this.velocity = 0;
      this.jumping = false;
    }
  }
  
  isJumping() {
    return this.jumping;
  }
  
  updateJumping() {
    this.velocity = -jumpHeight;
    this.jumping = true;
  }
  
  getPoint() {
    return {x: this.x, y: this.y};
  }
  
  setColor(color) {
    this.color = color;
  }
  
  getHealth() {
    return this.health;
  }
  
  setHealth(health) {
    this.health = health;
  }

  getPower() {
    return this.power;
  }

  setPower(power) {
    this.power = power;
  }

  superMode() {
    return this.power === 10;
  }

  getSuperColor() {
    return color(Math.random() * 256, Math.random() * 256, Math.random() * 256);
  }
}