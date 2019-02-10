function Two048(canvas, n){
	this.offset = scaleFactor*10;
	this.n = n;
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d", {alpha: false});
	this.size = canvas.width - 2*this.offset;
	this.isPaused = true;
	this.slideDuration = 1000;
	this.tiles = [];

	for(var i=0; i<n; i++){
		this.tiles.push([]);
		for(var j=0; j<n; j++){
			this.tiles[i].push(null);
		}
	}

	this.tileSize = (this.size - this.n*this.offset)/this.n;
	var px = -1, py = -1, x = -1, y = -1;
	for(var i=0; i<2; i++){
		while(x == px && y == py){
			x = random(0, 4);
			y = random(0, 4);
		}
		px = x;
		py = y;
		this.tiles[x][y] = new Tile(this.tileSize, x, y, this.offset);
	}

	this.draw();
}

Two048.prototype.draw = function(noTiles){
	this.ctx.save();
	this.ctx.lineWidth = this.offset*2;
	this.ctx.fillStyle = "#bcaaa4";
	this.ctx.strokeStyle = "#a1887f";
	this.ctx.fillRect(0, 0, this.size + 2*this.offset, this.size + 2*this.offset);
	for(var i=0; i<this.n+1; i++){
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.offset + i*(this.offset+this.tileSize));
		this.ctx.lineTo(2*this.offset + this.size, this.offset + i*(this.offset+this.tileSize));
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.beginPath();
		this.ctx.moveTo(this.offset + i*(this.offset+this.tileSize), 0);
		this.ctx.lineTo(this.offset + i*(this.offset+this.tileSize), 2*this.offset + this.size);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	this.ctx.restore();
	for(var i=0; i<this.n; i++){
		for(var j=0; j<this.n; j++){
			if(this.tiles[i][j]){
				this.tiles[i][j].draw(this.ctx);
			}
		}
	}
};

Two048.prototype.moveLeft = function(){
	var deltaX =
	animate(function () {

	}, this.slideDuration);
};

Two048.prototype.moveRight = function(){

};

Two048.prototype.moveUp = function(){

};

Two048.prototype.moveDown = function(){

};

Two048.prototype.canMoveLeft = function(j){
	return true;
};

Two048.prototype.canMoveRight = function(j){
	return true;
};

Two048.prototype.canMoveUp = function(j){
	return true;
};

Two048.prototype.canMoveDown = function(j){
	return true;
};
