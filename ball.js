class Ball {
  constructor() {
    this.offset = 0;
    this.velocity = 0;
    this.gravity = 0.8;
    this.jumping = false;
    this.radius = 25;
    this.color = "white";
    this.health = 10;
    this.power = 10;
    this.x = 0;
    this.y = 0;
  }
  
  draw(stepY) {
    noStroke();
    this.x = map(2, 1, limit - 2, 0, width);
    this.y = height / 2 * (1 - stepY);
    this.jump();
    this.y += this.offset;
    for (let r = 40; r >= this.radius; r -= 2) {
      fill(red(this.color), green(this.color), blue(this.color), 30);
      circle(this.x, this.y, r);
    }
    fill(this.color);
    circle(this.x, this.y, this.radius);
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
    this.velocity = -12;
    this.jumping = true;
  }
  
  getRadius() {
    return this.radius;
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
}