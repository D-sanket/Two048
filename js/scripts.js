var startX, startY, stopX, stopY;
var minDelta = 10;

var game = new Two048(canvas, 4);

canvas.onclick = function(){
	if(game.isPaused){
		game.start();
	}
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
