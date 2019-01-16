var globalBrightness = 0;

/**
 * Handles user inputs from the HTML page
 */
function getOptions(){
    //assigning user inputs to variables
    var dragOption = document.getElementById("dragRange").value;
    //changing standardised drag value to actual drag value
    if (dragOption == 1){
        dragOption = 0.7;
    }
    else if (dragOption == 2){
        dragOption = 0.77;
    }
    else if (dragOption == 3){
        dragOption = 0.84;
    }
    if (dragOption == 4){
        dragOption = 0.89;
    }
    if (dragOption == 5){
        dragOption = 0.95;
    }
    var hueOption = document.getElementById("hueRange").value;
    var heightOption = document.getElementById("heightRange").value;
    //creates a new line under the user-determined settings and appends to globalLines' lineset.
    globalLines.addLine(new line (dragOption,heightOption, hueOption));
}

/**
 * Function called when a key is pressed. If Z is pressed, the last line added is cleared.
 */
function keyPressed() {
    // the last added line is removed from the screen when Z is clicked
    if (keyCode == 90) {
        globalLines.removeLine() //removes the last line from the globalLines array
    }

}

/**
 * Function called when the mouse is double clicked. This moves the last added line towards where the cursor double-clicked.
 */

function doubleClicked() {
    //Set a default value for newHeightConst
    var newHeightConst = 5;
    //Changes the heightConst depending on where the mouse double-clicked.
    var heightPartition = (windowHeight/10);
    if (mouseY > windowHeight-heightPartition) {
        newHeightConst = 1;
    } else if (mouseY > (windowHeight-(heightPartition*2))) {
        newHeightConst = 2;
    } else if (mouseY > (windowHeight-(heightPartition*3))) {
        newHeightConst = 3;
    } else if (mouseY > (windowHeight-(heightPartition*4))) {
        newHeightConst = 4;
    } else if (mouseY > (windowHeight-(heightPartition*5))) {
        newHeightConst = 5;
    } else if (mouseY > (windowHeight-(heightPartition*6))) {
        newHeightConst = 6;
    } else if (mouseY > (windowHeight-(heightPartition*7))) {
        newHeightConst = 7;
    } else if (mouseY > (windowHeight-(heightPartition*8))) {
        newHeightConst = 8;
    } else if (mouseY > (windowHeight-(heightPartition*9))) {
        newHeightConst = 9;
    } else if (mouseY > (windowHeight-(heightPartition*10))) {
        newHeightConst = 11;
    } else {
        newHeightConst = 13;
    }

    //gets the last line in the globalLines and assigns to finalLine
    var finalLine =globalLines.lineSet[globalLines.numLines-1];
    //the most recently added line is removed
    globalLines.removeLine()
    var origDrag = finalLine.drag;
    var origHue = finalLine.hueVal;
    //a new line is constructed and appended into globalLines with the new heightConst
    globalLines.addLine(new line(origDrag, newHeightConst, origHue));

}
/** @class A class that represents a collection of lines. It makes it easier to manage all the lines as a single unit,
 * using an array */
class lineCollection{
    /**
     * @constructor
     * Creates an array of lines, and initialises properties that allow the management of the lines as a single unit.
     */
    constructor(){
        /**
         * This list holds all 'line' objects currently existing.
         * @type {line[]}
         * @private
         */
        this._lineSet = []; //initialising an empty array to hold all lines.
        //Holds the total number of lines stored in _lineSet
        this._numLines = 0;
        //Holds a boolean value representing whether the flat checkbox is checked.
        this._flat = false;
        //Holds a boolean value representing whether the anti-gravity checkbox is checked.
        this._grav = false;
    }

    /**
     * Appends a new line to the _lineSet array and increments numLines
     * @param {Object} newLine
     * @returns {undefined} nothing
     */
    addLine(newLine) {
        this.lineSet.push(newLine);
        this.numLines += 1;
    }

    /**
     * Removes the most recently added line from the _lineSet array and decrements numLines
     * @returns {undefined} nothing
     */
    removeLine() {
        this.lineSet.pop();
        this.numLines -= 1;
    }

    /**
     * Removes all lines from the _lineSet array and sets numLines to 0
     * @returns {undefined} nothing
     */
    clearLines() {
        this.lineSet = [];
        this.numLines = 0;
    }

    /**
     * Sets whether the gravity checkbox has been checked.
     * @param {boolean} newGrav
     * @returns {undefined} nothing
     */

    set grav(newGrav) {
        this._grav = newGrav;
    }

    /**
     * Sets the _lineSet property with an array of line objects.
     * @param {Object} newLineSet
     * @returns {undefined} nothing
     */

    set lineSet(newLineSet) {
        this._lineSet = newLineSet;
    }

    /**
     * Sets the numLines property to hold the number of lines contained in the _lineSet array.
     * @param {number} newNumLines
     * @returns {undefined} nothing
     */

    set numLines(newNumLines) {
        this._numLines = newNumLines;
    }

    /**
     * Sets whether the flatten checkbox has been checked.
     * @param {boolean} newFlat
     * @returns {undefined} nothing
     */
    set flat(newFlat) {
        this._flat = newFlat;
    }

    /**
     * Gets the number of lines held in the _lineSet array.
     * @returns {number}
     */

    get numLines() {
        return this._numLines;
    }

    /**
     * Gets the array of lines in the lineCollection stored in _lineSet.
     * @returns {line[]}
     */

    get lineSet() {
        return this._lineSet;
    }

    /**
     * Gets whether the flat checkbox has been checked.
     * @returns {boolean}
     */

    get flat() {
        return this._flat;
    }

    /**
     * Gets whether the anti-gravity checkbox has been checked.
     * @returns {boolean}
     */

    get grav() {
        return this._grav;
    }

}

/** @class A class that represents an individual line, consisting of an array of particle objects. A line can be manipulated
 * and personalised by the user using the tools on the HTML page.*/
class line{
    /**
     * @constructor
     * Create a line using the following parameters:
     * @param {number} drag - determines how slowly the line responds to the cursor.
     * @param {number} heightConst - determines how high up the screen the line is outputted.
     * @param {number} hueVal - the hue value of the line, specified using a slider.
     */
    constructor(drag = 0.85, heightConst = 5, hueVal = 100){
        this._t = width; //width of the screen.
        this._drag = drag; //drag, i.e. responsiveness of line to the cursor.
        this._heightConst = heightConst; //how high up on the screen the line is
        this._hueVal = hueVal; //the hue of the line, 0-255
        this._bright = 0; //initial brightness of the line
        this._prevY = 0; //used in the anti-gravity setting to temporarily hold the last Y value of a line particle


        this._allParticles = []; //initialising empty array to hold all the particles making up the line

        //if the flatten checkbox has not been checked
        if (globalLines.flat == false) {
            //spawn particles along screen width for initial view
            //x begins at 0, incrementing in 5 while less than screen width
            for (var x = 0; x < width; x += 5 ) {
                var y = height/this._heightConst+noise(x*0.005)*500; //y coordinate of particle, dependent on user chosen variable heightConst
                //instantiate a particle with (x,y) coordinates, hue and drag values.
                //push this particle onto allParticles
                this._allParticles.push(new Particle(x,y,this._hueVal, this._drag));
            }
        } else {
            //spawn particles along screen width for initial view
            //x begins at 0, incrementing in 5 while less than screen width
            for (var x = 0; x < width; x += 5 ) {
                //y coordinate of particle, dependent on user chosen variable heightConst.
                //no noise is added so the line is flat.
                var y = height/this._heightConst;
                //instantiate a particle with (x,y) coordinates, hue and drag values.
                //push this particle onto allParticles
                this._allParticles.push(new Particle(x,y,this._hueVal, this._drag));
            }
        }


    }

    /**
     * Gets the Y value of the last particle examined in an array of particles making up a line.
     * @returns {number}
     */

    get prevY() {
        return this._prevY;
    }

    /**
     * Gets the array of particles making up a line.
     * @returns {Particle[]}
     */

    get allParticles() {
        return this._allParticles;
    }

    /**
     * Gets the user determined drag value of a line.
     * @returns {number}
     */

    get drag() {
        return this._drag;
    }

    /**
     * Gets the t value, i.e. the width of the screen.
     * @returns {number}
     */

    get t() {
        return this._t;
    }

    /**
     * Gets the user determined hue value of a line.
     * @returns {number}
     */

    get hueVal() {
        return this._hueVal;
    }

    /**
     * Gets the user determined height constant, determining the positioning of the line on the screen.
     * @returns {number}
     */

    get heightConst() {
        return this._heightConst;
    }

    /**
     * Sets the t property.
     * @param {number} newT
     * @returns {undefined} nothing
     */

    set t(newT) {
        this._t = newT;
    }

    /**
     * Sets the prevY property to hold the Y value of the last particle examined.
     * @param {number} newPrevY
     * @returns {undefined} nothing
     */

    set prevY(newPrevY) {
        this._prevY = newPrevY;
    }

    /**
     * Draws a particular line to the canvas.
     */

    draw() {
        noFill();
        //go through each particle of line
        for (var i = 0; i < this.allParticles.length-1; i++) {
            var currentParticle = this.allParticles[i];
            //move the particular particle
            currentParticle.move();

            if (i > 1) {
                //determine distance between current particle coordinates and target coordinates, as a scalar.
                var d = dist(currentParticle.pos.x, currentParticle.pos.y, currentParticle.target.x, currentParticle.target.y);

                //The further away its from its target, the bigger and more saturated it is.
                //setting the particle to user determined hue value.
                stroke(this.hueVal, d*10, currentParticle.b);

                strokeWeight(constrain(d*0.1, 1, 7)); //adjusting thickness of stroke, 1/10th of distance, between 1 and 7.

                beginShape(); //begin recording vertices.
                curveVertex(this.allParticles[i-2].pos.x, this.allParticles[i-2].pos.y); //guides beginning of curve
                curveVertex(this.allParticles[i-1].pos.x, this.allParticles[i-1].pos.y); //curve between this point...
                curveVertex(this.allParticles[i].pos.x, this.allParticles[i].pos.y); //...and this point
                curveVertex(this.allParticles[i+1].pos.x, this.allParticles[i+1].pos.y); //guides end of curve.
                endShape(); //end recording vertices.
            }

            //Delete the particle if out of bounds.
            if (currentParticle.pos.x < -50) {
                this.allParticles.splice(i,1);
            }
        }
        //Spawn a new particle.
        if (this.t % 5 == 0) {
            //If the lines are not to be flat:
            if (globalLines.flat == false) {
                //If the anti-gravity is on:
                if (globalLines.grav == true) {
                    print('prevY ', this.prevY);
                    if (this.prevY < (height - 100)) {
                        print('less than height-100')
                        var y = (this.prevY + 50) * noise(this.t*0.005) ;
                        print(y);
                    } else {
                        print('more than height-100')
                        var y = this.prevY //* noise(this.t*0.005)*500;
                    }
                    //If the anti-gravity is off:
                } else{
                    //The greater the const being added to the noise, the greater the y value:
                    var y = height/this.heightConst + noise(this.t*0.005)*500;
                }
                //If the lines are to be flat:
            } else {
                var y = height/this.heightConst; //no noise is added so the lines are flat
            }

            this.prevY = y;
            //new particle spawned at the end of screen
            this.allParticles.push(new Particle(width, y, this.hueVal, this.drag));
        }

        this.t+= 1; //incrementing t

    }

}

/** @class A class that represents the individual particles making up a line. */
class Particle {

    /**
     * @constructor
     * Initialises the properties of an individual particle.
     * @param {number} x - the initial x value of a particle, to be used in a vector.
     * @param {number} y - the initial y value of a particle, to be used in a vector.
     * @param {number} hueVal - the user determined hue value of a particle.
     * @param {number} drag - determines how slowly the particle responds to the cursor, as specified by the user.
     */
    constructor(x = 100,y = 100,hueVal = 100, drag = 0.8){
        this.pos = new p5.Vector(x, y); //vector of particle position
        this.vel = new p5.Vector(0, 0); //vector of particle velocity
        this.acc = new p5.Vector(0, 0); //vector of particle acceleration
        this.target = new p5.Vector(x, y); //vector of particle target
        this.drag = drag; //user determined drag

        this.b = globalBrightness; //initialising brightness of particle

        globalBrightness += 10; //incrementing brightness value by 10
        //at upper bound of brightness, set brightness back to 1
        if (globalBrightness > 255) {
            globalBrightness = 1;
        }
    }

    /**
     * Moves a particle across the page and handles reactions to the cursor.
     */
    move() {
        //shift particle to the left
        this.pos.x -= 1;
        this.target.x -=1;

        //distance between cursor and particle as a single scalar value
        var d = dist(mouseX, mouseY, this.pos.x, this.pos.y);

        if (d<200) {
            var mousePos = new p5.Vector(mouseX, mouseY); //vector of cursor position
            var vec = new p5.Vector(this.pos.x, this.pos.y); //vector of particle position
            vec.sub(mousePos); //subtract mousePos vector from particle position vector
            vec.normalize();
            vec.mult(0.6);
            this.acc.add(vec); //add vec to particle acceleration value
        }

        //Seek its original position
        var seek = new p5.Vector(this.target.x, this.target.y); //vector of particle position
        seek.sub(this.pos); //subtract particle position
        seek.normalize();

        var targetDist = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
        if (targetDist < 5) {
            // When it gets close enough, decrease the multiplier so it can settle!
            seek.mult(0.5*map(targetDist, 5, 0, 1, 0)); //multiply by a number betweeen 0-1
        } else {
            seek.mult(0.5);
        }

        this.acc.add(seek); //adding to acceleration

        // Add some drag.
        this.vel.mult(this.drag); //slow down velocity

        // Move it.
        this.vel.add(this.acc); //add to velocity
        this.pos.add(this.vel); //add to position
        this.acc.mult(0); //set acceleration to 0

    }
}


/**
 * Function called when the flatten checkbox is checked. Existing lines are cleared and regenerated with different
 * settings.
 */

function refreshLines() {
    //existing lines in globalLines are copied into tempLines.
    var tempLines = new lineCollection()
    for (var x = 0; x <globalLines.numLines; x++) {
        tempLines.addLine(globalLines.lineSet[x])
    }
    //globalLines is cleared so lines with new flattened settings can be appended.
    globalLines.clearLines();
    for (var x = 0; x < tempLines.numLines; x++) {
        var tempHeight = tempLines.lineSet[x].heightConst;
        var tempHue = tempLines.lineSet[x].hueVal;
        var tempDrag = tempLines.lineSet[x].drag;
        //the line constructor is called again, and lines are re-appended to globalLines- this time flattened.
        newLine = new line (tempDrag,tempHeight, tempHue)
        print(newLine);
        globalLines.addLine(newLine);
    }
}

;