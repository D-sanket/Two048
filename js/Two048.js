function Two048(canvas, n){
	this.offset = scaleFactor*15;
	this.n = n;
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d", {alpha: false});
	this.size = canvas.width - 2*this.offset;
	this.isPaused = true;
	this.slideDuration = 20;
	this.fps = 60;
	this.tiles = [];

	for(var i=0; i<n; i++){
		var temp = [];
		for(var j=0; j<n; j++){
			temp.push(null);
		}
		this.tiles.push(temp);
	}

	this.tileSize = (this.size - (this.n-1)*this.offset)/this.n;
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

	// this.tiles[1][1] = new Tile(this.tileSize, 1, 1, this.offset, 2);
	// this.tiles[3][1] = new Tile(this.tileSize, 3, 1, this.offset, 4);

	this.draw();
}

Two048.prototype.draw = function(noTiles){
	this.ctx.save();
	this.ctx.lineWidth = this.offset;
	this.ctx.fillStyle = "#bcaaa4";
	this.ctx.strokeStyle = "#a1887f";
	this.ctx.fillRect(0, 0, this.size + 2*this.offset, this.size + 2*this.offset);
	for(var i=0; i<this.n+1; i++){
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.offset/2 + i*(this.offset+this.tileSize));
		this.ctx.lineTo(2*this.offset + this.size, this.offset/2 + i*(this.offset+this.tileSize));
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.beginPath();
		this.ctx.moveTo(this.offset/2 + i*(this.offset+this.tileSize), 0);
		this.ctx.lineTo(this.offset/2 + i*(this.offset+this.tileSize), 2*this.offset + this.size);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	this.ctx.restore();
	for(var i=0; i<this.n; i++){
		for(var j=0; j<this.n; j++){
			if(this.tiles[i][j] != null){
				this.tiles[i][j].draw(this.ctx);
			}
		}
	}
};

Two048.prototype.setHasMoved = function(value){
	for(var i=0; i<this.n; i++){
		for(var j=0; j<this.n; j++){
			if(this.tiles[i][j]){
				this.tiles[i][j].hasMoved = value;
			}
		}
	}
};

Two048.prototype.moveLeft = function(){
	for(var x=1; x<this.n; x++){
		for(var y=0; y<this.n; y++){
			if(this.tiles[x][y]){
				if(!this.tiles[x][y].hasMoved){
					var tile = this.tiles[x][y];
					var value = tile.value;
					var nx = x-1;

					while(!this.tiles[nx][y] && nx > 0)
						nx--;

					if(this.tiles[nx][y] && nx != x)
						nx++;

					if(nx != x){
						if(nx-1 >= 0 && this.tiles[nx-1][y].value == this.tiles[x][y].value){
							this.tiles[nx-1][y] = new Tile(this.tileSize, nx-1, y, this.offset, parseInt(value)*2);
							this.tiles[nx-1][y].hasMoved = true;
						}
						else{
							this.tiles[nx][y] = new Tile(this.tileSize, nx, y, this.offset, value);
							this.tiles[nx][y].hasMoved = true;
						}
						this.tiles[x][y] = null;
					}

				}
			}
		}
	}
	this.draw();
	this.setHasMoved(false);
	console.log("Moving left..");
};

Two048.prototype.moveRight = function(){
	for(var x=this.n-2; x>=0; x--){
		for(var y=0; y<this.n; y++){
			if(this.tiles[x][y]){
				if(!this.tiles[x][y].hasMoved){
					var tile = this.tiles[x][y];
					var value = tile.value;
					var nx = x+1;

					while(!this.tiles[nx][y] && nx < this.n-1)
						nx++;

					if(this.tiles[nx][y] && nx != x)
						nx--;

					if(nx != x){
						this.tiles[nx][y] = new Tile(this.tileSize, nx, y, this.offset, value);
						this.tiles[nx][y].hasMoved = true;
						this.tiles[x][y] = null;
					}

				}
			}
		}
	}
	this.draw();
	this.setHasMoved(false);
	console.log("Moving right..");
};

Two048.prototype.moveUp = function(){
	for(var y=1; y<this.n; y++){
		for(var x=0; x<this.n; x++){
			if(this.tiles[x][y]){
				if(!this.tiles[x][y].hasMoved){
					var tile = this.tiles[x][y];
					var value = tile.value;
					var ny = y-1;

					while(!this.tiles[x][ny] && ny > 0)
						ny--;

					if(this.tiles[x][ny] && ny != y)
						ny++;

					if(ny != y){
						this.tiles[x][ny] = new Tile(this.tileSize, x, ny, this.offset, value);
						this.tiles[x][ny].hasMoved = true;
						this.tiles[x][y] = null;
					}

				}
			}
		}
	}
	this.draw();
	this.setHasMoved(false);
	console.log("Moving up..");
};

Two048.prototype.moveDown = function(){
	for(var y=this.n-2; y>=0; y--){
		for(var x=0; x<this.n; x++){
			if(this.tiles[x][y]){
				if(!this.tiles[x][y].hasMoved){
					var tile = this.tiles[x][y];
					var value = tile.value;
					var ny = y+1;

					while(!this.tiles[x][ny] && ny < this.n-1)
						ny++;

					if(this.tiles[x][ny] && ny != y)
						ny--;

					if(ny != y){
						this.tiles[x][ny] = new Tile(this.tileSize, x, ny, this.offset, value);
						this.tiles[x][ny].hasMoved = true;
						this.tiles[x][y] = null;
					}

				}
			}
		}
	}
	this.draw();
	this.setHasMoved(false);

	console.log("Moving down..");
};

Two048.prototype.canMoveLeft = function(i, j){
	if(i < 1)
		return false;
	if(this.tiles[i-1][j])
		return false;
	return true;
};

Two048.prototype.canMoveRight = function(i, j){
	if(i < this.n)
		return true;
	if(this.tiles[i+1][j] != null)
		return false;
	return false;
};

Two048.prototype.canMoveUp = function(i, j){
	if(j < 1)
		return false;
	if(this.tiles[i][j-1])
		return false;
	return true;
};

Two048.prototype.canMoveDown = function(i, j){
	if(j < this.n)
		return true;
	if(this.tiles[i][j+1])
		return false;
	return false;
};
