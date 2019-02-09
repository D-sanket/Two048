
var values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

function animate(func, frames){
	var count = 0;
	
	if(count < frames)
		requestAnimationFrame(anim);
	
	function anim(){
		func();
		count++;
		
		if(count < frames)
			requestAnimationFrame(anim);
	}
}

function Tile(size, x, y, o){
	this.size = size;
	this.o = o;
	this.x = o + x*size;
	this.y = o + y*size;
	this.xi = x;
	this.yi = y;
	this.offset = 5*scaleFactor;
	this.fillStyle = "white";
	this.value = values[random(0, 2)];
}

Tile.prototype.plusX = function(x){
	this.x += scaleFactor*x;
};

Tile.prototype.plusY = function(y){
	this.y += scaleFactor*y;
};

Tile.prototype.setColor = function(){
	switch(this.value){
		case 2:
			this.fillStyle = "#fff3e0";
			break;
		case 4:
			this.fillStyle = "#ffe0b2";
			break;
		case 8:
			this.fillStyle = "#ffab91";
			break;
		case 16:
			this.fillStyle = "#ff8a65";
			break;
		case 32:
			this.fillStyle = "#ff7043";
			break;
		case 64:
			this.fillStyle = "#ff5722";
			break;
		case 128:
			this.fillStyle = "#ffd180";
			break;
		case 256:
			this.fillStyle = "#ffd180";
			break;
		case 512:
			this.fillStyle = "#ffd54f";
			break;
		case 1024:
			this.fillStyle = "#ffc107";
			break;
		case 2048:
			this.fillStyle = "#ffd600";
			break;
	}
};

Tile.prototype.draw = function(ctx){
	this.setColor();
	
	ctx.save();
	ctx.fillStyle = this.fillStyle;
	ctx.fillRect(this.x+this.offset, this.y+this.offset, this.size-2*this.offset, this.size-2*this.offset);
	ctx.font="1000 "+(scaleFactor*30)+"px Aerial";
	ctx.textAlign="center"; 
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#424242";
	
	ctx.fillText(this.value ,this.x+(this.size/2),this.y+(this.size/2));
	ctx.restore();
	
};

function random(a, b){
	return Math.floor(Math.random()*(b-a)) + a;
}

function Two048(canvas, n){
	this.offset = scaleFactor*5;
	this.n = n;
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d", {alpha: false});
	this.size = canvas.width - 2*this.offset;
	this.isPaused = true;
	
	this.tiles = [];
	this.tileSize = this.size/this.n;
	var px = -1, py = -1, x = -1, y = -1;
	for(var i=0; i<2; i++){
		while(x == px && y == py){
			x = random(0, 4);
			y = random(0, 4);
		}
		px = x;
		py = y;
		this.tiles.push(new Tile(this.tileSize, x, y, this.offset));
	}
	
	this.startMenu();
}

Two048.prototype.moveLeft = function(){
	var frames = 20;
	var delta = (this.tileSize)/(frames*scaleFactor);
	var self = this;
	animate(function(){
		for(var i=0; i<self.tiles.length; i++){
			if(self.canMoveLeft(i)){
				self.tiles[i].plusX(-delta);
			}
		}
		
		self.draw();
	}, frames);
};

Two048.prototype.moveRight = function(){
	var frames = 20;
	var delta = (this.tileSize)/(frames*scaleFactor);
	var self = this;
	animate(function(){
		for(var i=0; i<self.tiles.length; i++){
			if(self.canMoveRight(i)){
				self.tiles[i].plusX(delta);
			}
		}
		
		self.draw();
	}, frames);
};

Two048.prototype.moveUp = function(){
	var frames = 20;
	var delta = (this.tileSize)/(frames*scaleFactor);
	var self = this;
	animate(function(){
		for(var i=0; i<self.tiles.length; i++){
			if(self.canMoveUp(i)){
				self.tiles[i].plusY(-delta);
			}
		}
		
		self.draw();
	}, frames);
};

Two048.prototype.moveDown = function(){
	var frames = 20;
	var delta = (this.tileSize)/(frames*scaleFactor);
	var self = this;
	animate(function(){
		for(var i=0; i<self.tiles.length; i++){
			if(self.canMoveDown(i)){
				self.tiles[i].plusY(delta);
			}
		}
		
		self.draw();
	}, frames);
};

Two048.prototype.canMoveLeft = function(j){
	if(this.tiles[j].x < this.offset)
		return false;
	for(var i=0; i<this.tiles.length; i++){
		if(j == i)
			continue;
		if(this.tiles[i].y == this.tiles[j].y){
			if(this.tiles[j].x - this.tiles[i].x < this.tileSize + this.offset)
				return false;
		}
	}
	
	return true;
};

Two048.prototype.flashText = function(text){
	var self = this;
	var flag = false;
	var count = 0;
	var interval = 20;
	requestAnimationFrame(writeAndErase);
	
	function writeAndErase(){
		if(flag)
			self.alertText("");
		else
			self.alertText(text);
		if(count%interval == 0)
			flag = !flag;
		count++;
		if(self.isPaused){
			requestAnimationFrame(writeAndErase);
		}
	}
};

Two048.prototype.startMenu = function(){
	this.flashText("Tap to start!");
};

Two048.prototype.start = function(){
	openFullScreen(document.getElementById("theGame"));
	var self = this;
	self.isPaused = false;
	setTimeout(function(){
		
		self.ctx.globalAlpha = 1;
		self.draw();
	}, 500);
};

Two048.prototype.alertText = function(text){
	this.draw(true);
	this.ctx.save();
	this.ctx.fillStyle = "lightgrey";
	this.ctx.globalAlpha = 0.5;
	this.ctx.fillRect(0, 0, 2*this.offset + this.size, 2*this.offset + this.size);
	this.ctx.font="1000 "+(scaleFactor*30)+"px Aerial";
	this.ctx.textAlign="center"; 
	this.ctx.textBaseline = "middle";
	this.ctx.fillStyle = "#424242";
	this.ctx.globalAlpha = 1;
	this.ctx.fillText(text, this.size/2, this.size/2);
	this.ctx.restore();
};

Two048.prototype.draw = function(noTiles){
	this.ctx.save();
	this.ctx.lineWidth = 10*scaleFactor;
	this.ctx.fillStyle = "#bcaaa4";
	this.ctx.strokeStyle = "#a1887f";
	this.ctx.fillRect(0, 0, this.size + 2*this.offset, this.size + 2*this.offset);
	for(var i=0; i<this.n+1; i++){
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.offset + i*this.tileSize);
		this.ctx.lineTo(2*this.offset + this.size, this.offset + i*this.tileSize);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.beginPath();
		this.ctx.moveTo(this.offset + i*this.tileSize, 0);
		this.ctx.lineTo(this.offset + i*this.tileSize, 2*this.offset + this.size);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	this.ctx.restore();
	if(true){
		for(var i=0; i<this.tiles.length; i++){
			this.tiles[i].draw(this.ctx);
		}
	}
};
