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

window.ontouchstart = function(e){
	var touch = e.targetTouches[0];
	startX = parseInt(touch.clientX);
	startY = parseInt(touch.clientY);
};

window.ontouchend = function(e){
	var touch = e.changedTouches[0];
	stopX = parseInt(touch.clientX);
	stopY = parseInt(touch.clientY);
	
	if(Math.abs(stopX-startX) > minDelta && Math.abs(stopY-startY) > minDelta){
		if(Math.abs(stopX-startX) > Math.abs(stopY-startY)){
			if(stopX-startX > 0)
				game.moveRight();
			else
				game.moveLeft();
		}
		else{
			if(stopY-startY > 0)
				game.moveDown();
			else
				game.moveUp();
		}
	}
	else if(Math.abs(stopX-startX) > minDelta && Math.abs(stopX-startX) < minDelta){
		if(stopX-startX > 0)
			game.moveRight();
		else
			game.moveLeft();
	}
	else if(Math.abs(stopX-startX) < minDelta && Math.abs(stopX-startX) > minDelta){
		if(stopY-startY > 0)
			game.moveDown();
		else
			game.moveUp();
	}
};

window.onkeyup = function (e) {
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
