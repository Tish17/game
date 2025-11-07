class Ball {
  constructor() {
    this.offset = 0;
    this.velocity = 0;
    this.jumping = false;
    this.color = ballColor;
    this.health = 10;
    this.power = 0;
    this.x = 0;
    this.y = 0;
  }
  
  draw(stepY) {
    this.x = map(2, 1, limit - 2, 0, width);
    this.y = height / 2 * (1 - amplitude * stepY);
    this.jump();
    this.y += this.offset;
    let superColor = this.superMode() ? this.getSuperColor() : this.color;
    fill(superColor);
    noStroke();
    circle(this.x, this.y, ballRadius);
  }
  
  jump() {
    let dtSeconds = deltaTime / 1000;
    this.velocity += gravity * dtSeconds;
    this.offset += this.velocity * dtSeconds;
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
    if (health <= 10) {
      this.health = health;
    }
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