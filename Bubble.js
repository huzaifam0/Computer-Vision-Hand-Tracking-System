class Bubble {
    constructor(x, y, r, difficultyFactor) {
        this.x = x;
        this.y = y;
        //set the speed of the circle in a random direction, that changes with the difficulty factor
        this.mx = random(1, 3) * difficultyFactor;
        this.my = random(1, 3) * difficultyFactor;
        this.r = r;
        this.popped = false;
    }

    move() {
        if (this.x < 0 || this.x > width) {
            this.mx *= -1;
        }
        if (this.y < 0 || this.y > height) {
            this.my *= -1;
        }
        this.x += this.mx;
        this.y += this.my;
    }

    display() {
        if (!this.popped) {
            noStroke();
            fill(255, 0, 0);
            ellipse(this.x, this.y, this.r * 2);
        }
    }

    pop() {
        this.popped = true;
    }

    isPopped(px, py) {
			//to slice the circles, this checks if the cricle is overlapping with the pinch.
        let d = dist(px, py, this.x, this.y);
        return d < this.r;
    }
}
