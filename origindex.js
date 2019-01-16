/*
Noisy rainbow

Controls:
	- Move the mouse along the lines to interact with it.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var steps = 5;
var restSize = 3;

var allParticles = [];
var t;
var globalHue = 0;


function Particle(x, y) {
    this.pos = new p5.Vector(x, y);
    this.vel = new p5.Vector(0, 0);
    this.acc = new p5.Vector(0, 0);

    this.target = new p5.Vector(x, y);
    this.h = globalHue;

    globalHue += 1;
    if (globalHue > 255) {
        globalHue = 0;
    }

    this.move = function() {
        // Shift particle to the left.
        this.pos.x -= 1;
        this.target.x -= 1;

        var d = dist(mouseX, mouseY, this.pos.x, this.pos.y);

        // Resolve collision with mouse.
        if (d < 200) {
            var mousePos = new p5.Vector(mouseX, mouseY);

            var vec = new p5.Vector(this.pos.x, this.pos.y);
            vec.sub(mousePos);
            vec.normalize();
            vec.mult(0.6);
            this.acc.add(vec);
        }

        // Seek its original position.
        var seek = new p5.Vector(this.target.x, this.target.y);
        seek.sub(this.pos);
        seek.normalize();

        var targetDist = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
        if (targetDist < 5) {
            // When it gets close enough, decrease the multiplier so it can settle!
            seek.mult(0.5*map(targetDist, 5, 0, 1, 0));
        } else {
            seek.mult(0.5);
        }

        this.acc.add(seek);

        // Add some drag.
        this.vel.mult(0.95);

        // Move it.
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
}


function setup() {
    createCanvas(windowWidth, windowHeight);

    colorMode(HSB, 255);

    textAlign(CENTER);
    textSize(16);

    t = width;

    // Spawn particles along the screen's width.
    for (var x = 0; x < width; x += steps) {
        var y = height/4+noise(x*0.005)*500;
        allParticles.push(new Particle(x, y));
    }
}


function draw() {
    background(50);

    noFill();

    for (var i = 0; i < allParticles.length-1; i++) {
        allParticles[i].move();

        // Draw lines.
        if (i > 1) {
            var d = dist(allParticles[i].pos.x, allParticles[i].pos.y,
                allParticles[i].target.x, allParticles[i].target.y);

            // The further away it's from its target, the more it's saturated and bigger.
            stroke(allParticles[i].h, d*10, 255);
            strokeWeight(constrain(d*0.1, 1, 7));

            beginShape();
            curveVertex(allParticles[i-2].pos.x, allParticles[i-2].pos.y);
            curveVertex(allParticles[i-1].pos.x, allParticles[i-1].pos.y);
            curveVertex(allParticles[i].pos.x, allParticles[i].pos.y);
            curveVertex(allParticles[i+1].pos.x, allParticles[i+1].pos.y);
            endShape();
        }

        // Delete the particle if it's out of bounds.
        if (allParticles[i].pos.x < -50) {
            allParticles.splice(i, 1);
        }
    }

    // Spawn a new particle.
    if (t % steps == 0) {
        var y = height/4+noise(t*0.005)*500;
        allParticles.push(new Particle(width, y));
    }
    t += 1;

    noStroke();
    fill(255);
    text("Move the mouse on the lines", width/2, 100);
}