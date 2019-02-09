function Tile(size, x, y){
	this.size = size;
	this.x = x;
	this.y = y;
	this.offset = 3;
	
}

Tile.prototype.plusX = function(x){
	this.x += x;
};

Tile.prototype.plusY = function(y){
	this.y += y;
};

Tile.prototype.draw = function(ctx){
	ctx.strokeRect(this.x+this.offset, this.y+this.offset, this.size-2*this.offset, this.size-2*this.offset);
};

function random(a, b){
	return Math.floor(Math.random()*(b-a)) + a;
}

function Two048(canvas, n){
	this.n = n;
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.size = canvas.width;
	
	this.tiles = [];
	this.tileSize = this.size/this.n;
	var px = -1, py = -1, x = -1, y = -1;
	for(var i=0; i<2; i++){
		while(x == px && y == py){
			x = random(0, 4)*this.tileSize;
			y = random(0, 4)*this.tileSize;
		}
		px = x;
		py = y;
		this.tiles.push(new Tile(this.tileSize, x, y));
	}
}

Two048.prototype.draw = function(){
	
	this.ctx.fillStyle = "lightgrey";
	this.ctx.fillRect(0, 0, this.size, this.size);
	for(var i=0; i<this.n+1; i++){
		this.ctx.beginPath();
		this.ctx.moveTo(0, i*this.tileSize);
		this.ctx.lineTo(this.size, i*this.tileSize);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.beginPath();
		this.ctx.moveTo(i*this.tileSize, 0);
		this.ctx.lineTo(i*this.tileSize, this.size);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	for(var i=0; i<this.tiles.length; i++){
		this.tiles[i].draw(this.ctx);
	}
};
