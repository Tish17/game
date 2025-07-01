let offset = 0;
let jumpVelocity = 0;
let gravity = 0.8;
let jumping = false;

const radius = 25;

class Ball {
  constructor() {
    
  }
  
  draw(color, stepY) {
    fill(color);
    noStroke();
    let x = map(2, 1, limit - 2, 0, width);
    let y = height / 2 * (1 - stepY);
    this.jump();
    y += offset;
    circle(x, y, radius);
    return {x, y};
  }
  
  jump() {
    jumpVelocity += gravity;
    offset += jumpVelocity;
    if (offset > 0) {
      offset = 0;
      jumpVelocity = 0;
      jumping = false;
    }
  }
  
  isJumping() {
    return jumping;
  }
  
  updateJumping() {
    jumpVelocity = -12;
    jumping = true;
  }
}