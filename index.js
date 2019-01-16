/**
 * Initial setup function, setting up the window and creating a lineCollection object to hold all user created lines.
 */
function setup() {
	createCanvas(windowWidth, windowHeight); //canvas covers whole screen
	colorMode(HSB, 255);
	textAlign(CENTER);
	textSize(16);
	globalLines = new lineCollection(); //initialise globalLines,to hold all existing line objects
}

/**
 * Draw function, iterating through each line in the lineCollection object, drawing each.
 */
function draw() {
	background(50); //setting background color
	noStroke();
	fill(255);
	text("Move the mouse on the lines.", width/2, 100);
	//iterates through each line in the lineCollection object while the array is not empty
	if (globalLines.lineSet != []) {
		for (i = 0; i < globalLines.lineSet.length; i++) {
			//calls the line draw method for each individual line
			globalLines.lineSet[i].draw();
		}

	}

}


document.addEventListener("DOMContentLoaded", function(){
	let f = document.getElementById("flatten");

	/**
	 * Checks to see whether the flatten checkbox is checked.
	 */
	function flattenToggle(event){
		let check = document.getElementById("flatten").checked;
		globalLines.flat = check;
		refreshLines()
	}
	f.addEventListener("change", flattenToggle);

	let g = document.getElementById("gravity");

	/**
	 * Checks to see whether the anti-gravity checkbox is checked.
	 */
	function gravityToggle(event){
		let check = document.getElementById("gravity").checked;
		globalLines.grav = check;
		print(globalLines.grav);
	}
	g.addEventListener("change", gravityToggle);

});