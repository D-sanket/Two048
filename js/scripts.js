var startX, startY, stopX, stopY;
var minDelta = 10;
var values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");
var canvasSize = parseInt(window.innerWidth * 0.9);
var scaleFactor = 3;
var theLog = document.getElementById("theLog");

canvas.style.height = canvasSize + "px";
canvas.height = scaleFactor * canvasSize;
canvas.width = scaleFactor * canvasSize;


var game = new Two048(canvas, 4);

function openFullScreen() {
	var elem = document.getElementById('theGame');
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}

}



function animate(func, callback, duration){
	var count = 0;

	if(count < duration)
		requestAnimationFrame(anim);

	function anim(){
		func();
		count++;

		if(count < duration)
			requestAnimationFrame(anim);
		else
		    callback();
	}
}



function random(a, b){
	return Math.floor(Math.random()*(b-a)) + a;
}

canvas.onclick = function(){
	// if(game.isPaused){
	// 	game.start();
	// }
};

var touched = false;
var count = 0;
window.onmousedown = function(){
	touched = true;
};

window.onmouseup = function(){
	touched = false;
	count = 0;
};

var myElement = document.getElementById("theGame");

var mc = new Hammer(myElement);

//enable all directions
mc.get('swipe').set({
  direction: Hammer.DIRECTION_ALL,
  threshold: 1, 
  velocity:0.1
});

// listen to events...
mc.on("swipeup swipedown swipeleft swiperight tap press", function(ev) {
  	switch(ev.type){
		case "swipeup":
			game.moveUp();
			break;
		case "swipedown":
			game.moveDown();
			break;
		case "swipeleft":
			game.moveLeft();
			break;
		case "swiperight":
			game.moveRight();
			break;
	}
});

window.onkeyup = function (e) {
    if(!game.isReady)
        return;
	if(e.key == "ArrowUp"){
		game.moveUp();
	}
	else if(e.key == "ArrowRight"){
		game.moveRight();
	}
	else if(e.key == "ArrowDown"){
		game.moveDown();
	}
	else if(e.key == "ArrowLeft"){
		game.moveLeft();
	}
};
