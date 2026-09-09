class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 20;
        this.moveX = random(-10, 10);
        this.moveY = random(-10, 10);
        this.a = 100;
        this.changeAlpha = random(5, 10);
    }

    display() {
        fill(255, this.a);
        noStroke();
        circle(this.x, this.y, this.w);
    }

    move() {
        this.a -= this.changeAlpha;
        this.x += this.moveX;
        this.y += this.moveY;
        this.w = max(0, this.w - 1);
    }
}
