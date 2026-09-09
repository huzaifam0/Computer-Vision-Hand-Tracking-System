//My game for this computer vision assignment is fruit ninja styled game but without the fruits
//The player's objective is to slice all the circles or bubbles and obtain the highest score you can
//you have 20 seconds to slice as many fruits as you can
//The name of the game is "Circle Slice" 

//The variables
let bubbles = [];  //this array represents the circles that bounce around the screen
let bubbleSpawnInterval = 2000; // Initial spawn interval in ms
let bubbleSpawnTimer = 0;
let video;
let handPose;
let hands = [];
let particles = [];
let score = 0;
let stateGame = "start"; //by doing this, the game starts as "start", and then when the timer runs out, the gamestate will change to gameover
//so this is a String variable, and the switch case will be used for this, showing play and gameover as states
let timeStart;
let lengthGame = 20000; //the length of the game in milliseconds, so the game will run for 20 seconds
let timegameOver = 0;

function preload() {
    handPose = ml5.handPose({ flipped: true });
}

function setup() {
    createCanvas(600, 400);
    video = createCapture(VIDEO, { flipped: true });
    video.hide();
    handPose.detectStart(video, gotHands);
    timeStart = millis(); //
}

function draw() {
    image(video, 0, 0);
    
    //The switch statement tell us the state of the game, so we will start with play and then switch to gameover
		//when the length of the game runs out which is 20 seconds
    switch (stateGame) {
        case "start":
            gameStart();
            // Check if the game duration has elapsed; if so, switch state to game over
            if (millis() - timeStart > lengthGame) {
                stateGame = "gameOver";
                timegameOver = millis();
            }
            break;
        case "gameOver":
            gameOver();
            // Automatically restart the game after 5 seconds in game over state
            if (millis() - timegameOver > 5000) {
                gameRestart();
            }
            break;
    }
    
    //this function shows us the score and the time left of the game on the top left corner
    HUDdisplay();
}

function gameStart() {
    //to change the difficulty of the game, I made it so then the spawn time of the circles
	//decreases by 500 milliseconds, and then that the speed increases as the game goes on, making it 
	//harder to get a higher score.
    bubbleSpawnInterval = max(500, 2000 - (millis() - timeStart) / 10);
    
    //to spawn circles to slash with our hands
    spawnBubble();
    
    //This code below is for the hands, so like it seperates how the system seperates the hands
	// there is one for left and one for right
	//right
    if (hands.length > 0) {
        for (let hand of hands) {
            if (hand.handedness === "Right") {
                let rightIndex = hand.index_finger_tip;
                let rightThumb = hand.thumb_tip;
                let d = dist(rightThumb.x, rightThumb.y, rightIndex.x, rightIndex.y);
                if (d < 30) {
                    //This creates the small circle that we could see on our hands that destroys the circles
                    noFill();
                    stroke(0, 255, 0);
                    circle(rightThumb.x, rightIndex.y, 20);
                    checkPinch(rightThumb.x, rightIndex.y);
                }
            }
					//left
            if (hand.handedness === "Left") {
                let leftThumb = hand.thumb_tip;
                let leftIndex = hand.index_finger_tip;
                let d = dist(leftThumb.x, leftThumb.y, leftIndex.x, leftIndex.y);
                if (d < 30) {
									//circle for left hand
                    noFill();
                    stroke(0, 255, 0);
                    circle(leftThumb.x, leftIndex.y, 20);
                    checkPinch(leftThumb.x, leftIndex.y);
                }
            }
        }
    }//end of if
    
    //spawn circles for the hands to slash
    for (let i = bubbles.length - 1; i >= 0; i--) {
        let bubble = bubbles[i];
        bubble.move();
        bubble.display();
        //The code over here is if the player fails to slash a bubble
			//if they fail to slash a bubble, then the bubble would be destroyed.
        if (bubble.x < -bubble.r || bubble.x > width + bubble.r || bubble.y < -bubble.r || bubble.y > height + bubble.r) {
            bubbles.splice(i, 1);
        }
    }
    
    //spawn the animation for slashing the circles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.move();
        p.display();
        if (p.a <= 0) {
            particles.splice(i, 1);
        }
    }
}

function spawnBubble() {
    // Spawn a new fruit if the interval has passed and there are fewer than 8 on screen
    if (millis() - bubbleSpawnTimer > bubbleSpawnInterval && bubbles.length < 8) {
			//the speed increases slowly overtime with this difficulty factor as stated before
			//this is the variable for it in the spawnBubble function
        let difficultyFactor = 1 + (millis() - timeStart) / lengthGame;
        bubbles.push(new Bubble(random(0, width),
                                  random(0, height),
                                  random(20, 50),
                                  difficultyFactor));
        bubbleSpawnTimer = millis();
    }
}

function checkPinch(px, py) {
    // this function checks if the small pinch that shows on our fingers will collide with any circle to slash it
    for (let i = bubbles.length - 1; i >= 0; i--) {
        let b = bubbles[i];
			
        if (b.isPopped(px, py)) {
            b.pop();
            bubbles.splice(i, 1);
            loadParticles(px, py);
					//to increase the score by 1 as a circle is slashed
            score += 1;
        }
    }
}//end of checkPinch function

function gotHands(results) {
    hands = results;
}

function loadParticles(x, y) {
//this function adds circles to our array
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y));
    }
}//end of loadParticles function

function HUDdisplay() {
	//this function is used to display the score of the player and the remaining time left in the top left corner
	//this is essential for keeping track of the player's score and how much time is remaining.
    fill(255);
    textSize(14);
    textAlign(LEFT, TOP);
	//to change the remaining time to seconds
    let timeRemaining = max(0, floor((lengthGame - (millis() - timeStart)) / 1000));
	//to display the text on the screen
		text("Time Left: " + timeRemaining, 10, 30);
    text("Player Score: " + score, 10, 10);
}

function gameOver() {
    //When the time runs out, this will be used to display the words "game over" on the screen
	//this would be put on the middle of the screen and will have a grayish color that we could still 
	//see the face camera, and then we will print the word "Final Player Score" below the gameOver
    background(0, 150);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(34);
    text("Game Over..", width / 2, height / 2 - 20);
    textSize(18);
    text("Player Final Score: " + score, width / 2, height / 2 + 20);
}

function gameRestart() {
    //this is to restart the game back to the original state so we could continue playing 
	//just to reset the game
    score = 0;
    bubbles = [];
    particles = [];
    timeStart = millis();
    stateGame = "start";
}
