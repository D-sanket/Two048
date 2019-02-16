function Two048(canvas, n, db) {
    this.offset = scaleFactor * 10;
    this.n = n;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", {alpha: false});
    this.size = canvas.width - 2 * this.offset;
    this.isPaused = true;
    this.slideDuration = 10;
    this.isReady = true;
    this.tiles = [];
    this.db = db;
    this.id = "";
    this.myIp = "";
    this.bgTask = false;
    for (var i = 0; i < n; i++) {
        var temp = [];
        for (var j = 0; j < n; j++) {
            temp.push(null);
        }
        this.tiles.push(temp);
    }

    this.tileSize = (this.size - (this.n - 1) * this.offset) / this.n;

    this.addTile();
    this.addTile();

    this.draw();

    this.drawBlankTileAt(0, 0);
    this.myTurn = false;
}

Two048.prototype.listenForMoves = function(){
    if (this.id == "")
        return;
    var self = this;

    db.collection("moves").doc(this.id)
        .onSnapshot(function(doc) {
            if(!self.myMove){
                var move = doc.data().move;
                var tile = {
                    x: doc.data().nx,
                    y: doc.data().ny,
                    value: doc.data().nval
                };
                switch(move){
                    case 1:
                        self.moveUp(tile);
                        break;
                    case 2:
                        self.moveRight(tile);
                        break;
                    case 3:
                        self.moveDown(tile);
                        break;
                    case 4:
                        self.moveLeft(tile);
                        break;
                }
            }
            if(doc.data().lastTurnBy != self.myIp)
                self.myTurn = true;
            else
                self.myTurn = false;
            self.myMove = true;
        });
};

Two048.prototype.toFirebase = function (direction, newTile) {
    if (this.id == "" || this.myIp == "")
        return;
    this.bgTask = true;
    var self = this;

    var moveRef = self.db.collection('moves').doc(self.id);
    var gameRef = this.db.collection('games').doc(self.id);
    var userRef = this.db.collection('users').doc(self.myIp);


    var batch = db.batch();
    batch.set(moveRef, {
        move: direction,
        nx: newTile.x,
        ny: newTile.y,
        nval: newTile.value,
        lastTurnBy: self.myIp
    });

    batch.update(gameRef, {
        game: JSON.stringify(self.tiles),
        lastTurnBy: self.myIp
    });

    batch.update(userRef, {
        timestamp: Date.now()
    });

    batch.commit().then(function () {
        self.myTurn = false;
        self.resume();
    });
};

Two048.prototype.pause = function () {
    this.isReady = false;
};

Two048.prototype.resume = function () {
    this.isReady = true;
};

Two048.prototype.setTiles = function (tiles) {
    this.tiles = [];
    for (var i = 0; i < this.n; i++) {
        var temp = [];
        for (var j = 0; j < this.n; j++) {
            if (!tiles[i][j])
                temp.push(null);
            else
                temp.push(new Tile(this.tileSize, tiles[i][j].x, tiles[i][j].y, this.offset, tiles[i][j].value));
        }
        this.tiles.push(temp);
    }
};

Two048.prototype.getFreeSpace = function () {
    var result = [];
    for (var i = 0; i < this.n; i++) {
        for (var j = 0; j < this.n; j++) {
            if (!this.tiles[i][j]) {
                result.push({
                    x: i, y: j
                });
            }
        }
    }

    return result;
};

Two048.prototype.draw = function (noTiles) {
    this.ctx.save();
    this.ctx.lineWidth = this.offset;
    this.ctx.fillStyle = "#bcaaa4";
    this.ctx.strokeStyle = "#a1887f";
    this.ctx.fillRect(0, 0, this.size + 2 * this.offset, this.size + 2 * this.offset);
    for (var i = 0; i < this.n + 1; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.offset / 2 + i * (this.offset + this.tileSize));
        this.ctx.lineTo(2 * this.offset + this.size, this.offset / 2 + i * (this.offset + this.tileSize));
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.moveTo(this.offset / 2 + i * (this.offset + this.tileSize), 0);
        this.ctx.lineTo(this.offset / 2 + i * (this.offset + this.tileSize), 2 * this.offset + this.size);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.ctx.restore();
    for (var i = 0; i < this.n; i++) {
        for (var j = 0; j < this.n; j++) {
            if (this.tiles[i][j] != null) {
                this.tiles[i][j].draw(this.ctx);
            }
        }
    }
};

Two048.prototype.addTile = function () {
    var freeSpace = this.getFreeSpace();
    if (freeSpace.length == 0) {
        alert("Game over!");
    }
    else {
        var idx = random(0, freeSpace.length);
        var x = freeSpace[idx].x;
        var y = freeSpace[idx].y;

        this.tiles[x][y] = new Tile(this.tileSize, x, y, this.offset);

        return this.tiles[x][y];
    }
};

Two048.prototype.setHasMoved = function (value) {
    for (var i = 0; i < this.n; i++) {
        for (var j = 0; j < this.n; j++) {
            if (this.tiles[i][j]) {
                this.tiles[i][j].hasMoved = value;
                this.tiles[i][j].isMixed = value;
                this.tiles[i][j].toBeDrawn = true;
            }
        }
    }
};

Two048.prototype.drawBlankTileAt = function (x, y, value) {
    var tile = new Tile(this.tileSize, x, y, this.offset);
    tile.value = value ? value : "";
    tile.draw(this.ctx);
};

Two048.prototype.animateTiles = function (changedTiles, direction, _tile) {
    var self = this;
    var tiles = [];
    this.pause();
    for (var i = 0; i < changedTiles.length; i++) {
        var x = changedTiles[i].x;
        var y = changedTiles[i].y;
        var nx = changedTiles[i].nx;
        var ny = changedTiles[i].ny;
        var toBeDoubled = changedTiles[i].toBeDoubled;
        var oldTile = self.tiles[nx][ny];
        var value = toBeDoubled ? oldTile.value / 2 : oldTile.value;
        var tile = new Tile(self.tileSize, x, y, self.offset, value);
        tiles.push(tile);

        // self.drawBlankTileAt(x, y);
    }

    var delta = (this.tileSize + this.offset) / this.slideDuration;
    animate(function () {
        self.draw();
        for (var i = 0; i < tiles.length; i++) {
            var x = changedTiles[i].x;
            var y = changedTiles[i].y;
            var nx = changedTiles[i].nx;
            var ny = changedTiles[i].ny;
            var toBeDoubled = changedTiles[i].toBeDoubled;
            var oldTile = self.tiles[nx][ny];
            var value = toBeDoubled ? oldTile.value / 2 : oldTile.value;
            var tile = tiles[i];

            if (x != nx) {
                if (x < nx) {
                    tile.plusX(delta * (nx - x));
                }
                else {
                    tile.plusX(-delta * (x - nx));
                }
            }
            else if (y != ny) {
                if (y < ny) {
                    tile.plusY(delta * (ny - y));
                }
                else {
                    tile.plusY(-delta * (y - ny));
                }
            }

            tile.draw(self.ctx);
        }
    }, function () {
        if (changedTiles.length > 0 && !_tile){
            var newTile = self.addTile();
            self.toFirebase(direction, newTile);
        }
        else if(_tile){
            self.tiles[_tile.x][_tile.y] = new Tile(self.tileSize, _tile.x, _tile.y, self.offset, _tile.value);
        }

        self.setHasMoved(false);
        self.draw();
        if(!self.bgTask)
            self.resume();
    }, this.slideDuration);
};

Two048.prototype.moveLeft = function (_tile) {
    var changedTiles = [];
    for (var x = 1; x < this.n; x++) {
        for (var y = 0; y < this.n; y++) {
            if (this.tiles[x][y]) {
                if (!this.tiles[x][y].hasMoved) {
                    var tile = this.tiles[x][y];
                    var value = tile.value;
                    var nx = x - 1;

                    while (!this.tiles[nx][y] && nx > 0)
                        nx--;

                    if (this.tiles[nx][y] && nx != x)
                        nx++;

                    if (nx - 1 >= 0 && nx != x) {
                        if (this.tiles[nx - 1][y].value == this.tiles[x][y].value && !this.tiles[nx - 1][y].isMixed) {
                            this.tiles[nx - 1][y] = new Tile(this.tileSize, nx - 1, y, this.offset, parseInt(value) * 2);
                            this.tiles[nx - 1][y].hasMoved = true;
                            this.tiles[nx - 1][y].isMixed = true;
                            this.tiles[nx - 1][y].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: nx - 1,
                                ny: y,
                                toBeDoubled: true
                            });
                        }
                        else {
                            this.tiles[nx][y] = new Tile(this.tileSize, nx, y, this.offset, value);
                            this.tiles[nx][y].hasMoved = true;
                            this.tiles[nx][y].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: nx,
                                ny: y,
                                toBeDoubled: false
                            });
                        }

                    } else if (nx != x) {
                        this.tiles[nx][y] = new Tile(this.tileSize, nx, y, this.offset, value);
                        this.tiles[nx][y].hasMoved = true;
                        this.tiles[nx][y].toBeDrawn = false;
                        this.tiles[x][y] = null;

                        changedTiles.push({
                            x: x,
                            y: y,
                            nx: nx,
                            ny: y,
                            toBeDoubled: false
                        });
                    }
                    else {
                        if (this.tiles[nx - 1][y].value == this.tiles[x][y].value && !this.tiles[nx - 1][y].isMixed) {
                            this.tiles[nx - 1][y] = new Tile(this.tileSize, nx - 1, y, this.offset, parseInt(value) * 2);
                            this.tiles[nx - 1][y].hasMoved = true;
                            this.tiles[nx - 1][y].isMixed = true;
                            this.tiles[nx - 1][y].toBeDrawn = false;
                            this.tiles[x][y] = null;

                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: nx - 1,
                                ny: y,
                                toBeDoubled: true
                            });
                        }
                    }

                }
            }
        }
    }

    this.animateTiles(changedTiles, 4, _tile);
};

Two048.prototype.moveRight = function (_tile) {
    var changedTiles = [];
    for (var x = this.n - 2; x >= 0; x--) {
        for (var y = 0; y < this.n; y++) {
            if (this.tiles[x][y]) {
                if (!this.tiles[x][y].hasMoved) {
                    var tile = this.tiles[x][y];
                    var value = tile.value;
                    var nx = x + 1;

                    while (!this.tiles[nx][y] && nx < this.n - 1)
                        nx++;

                    if (this.tiles[nx][y] && nx != x)
                        nx--;

                    if (nx + 1 < this.n && nx != x) {
                        if (this.tiles[nx + 1][y].value == this.tiles[x][y].value && !this.tiles[nx + 1][y].isMixed) {
                            this.tiles[nx + 1][y] = new Tile(this.tileSize, nx + 1, y, this.offset, parseInt(value) * 2);
                            this.tiles[nx + 1][y].hasMoved = true;
                            this.tiles[nx + 1][y].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: nx + 1,
                                ny: y,
                                toBeDoubled: true
                            });
                        }
                        else {
                            this.tiles[nx][y] = new Tile(this.tileSize, nx, y, this.offset, value);
                            this.tiles[nx][y].hasMoved = true;
                            this.tiles[nx][y].isMixed = true;
                            this.tiles[nx][y].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: nx,
                                ny: y,
                                toBeDoubled: false
                            });
                        }

                    } else if (nx != x) {
                        this.tiles[nx][y] = new Tile(this.tileSize, nx, y, this.offset, value);
                        this.tiles[nx][y].hasMoved = true;
                        this.tiles[nx][y].toBeDrawn = false;
                        this.tiles[x][y] = null;

                        changedTiles.push({
                            x: x,
                            y: y,
                            nx: nx,
                            ny: y,
                            toBeDoubled: false
                        });
                    }
                    else {
                        if (this.tiles[nx + 1][y].value == this.tiles[x][y].value && !this.tiles[nx + 1][y].isMixed) {
                            this.tiles[nx + 1][y] = new Tile(this.tileSize, nx + 1, y, this.offset, parseInt(value) * 2);
                            this.tiles[nx + 1][y].hasMoved = true;
                            this.tiles[nx + 1][y].toBeDrawn = false;
                            this.tiles[x][y] = null;

                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: nx + 1,
                                ny: y,
                                toBeDoubled: true
                            });
                        }
                    }

                }
            }
        }
    }
    this.animateTiles(changedTiles, 2, _tile);
};

Two048.prototype.moveUp = function (_tile) {
    var changedTiles = [];
    for (var y = 1; y < this.n; y++) {
        for (var x = 0; x < this.n; x++) {
            if (this.tiles[x][y]) {
                if (!this.tiles[x][y].hasMoved) {
                    var tile = this.tiles[x][y];
                    var value = tile.value;
                    var ny = y - 1;

                    while (!this.tiles[x][ny] && ny > 0)
                        ny--;

                    if (this.tiles[x][ny] && ny != y)
                        ny++;

                    if (ny - 1 >= 0 && ny != y) {
                        if (this.tiles[x][ny - 1].value == this.tiles[x][y].value && !this.tiles[x][ny - 1].isMixed) {
                            this.tiles[x][ny - 1] = new Tile(this.tileSize, x, ny - 1, this.offset, parseInt(value) * 2);
                            this.tiles[x][ny - 1].hasMoved = true;
                            this.tiles[x][ny - 1].isMixed = true;
                            this.tiles[x][ny - 1].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: x,
                                ny: ny - 1,
                                toBeDoubled: true
                            });
                        }
                        else {
                            this.tiles[x][ny] = new Tile(this.tileSize, x, ny, this.offset, value);
                            this.tiles[x][ny].hasMoved = true;
                            this.tiles[x][ny].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: x,
                                ny: ny,
                                toBeDoubled: false
                            });
                        }
                    } else if (ny != y) {
                        this.tiles[x][ny] = new Tile(this.tileSize, x, ny, this.offset, value);
                        this.tiles[x][ny].hasMoved = true;
                        this.tiles[x][ny].toBeDrawn = false;
                        this.tiles[x][y] = null;
                        changedTiles.push({
                            x: x,
                            y: y,
                            nx: x,
                            ny: ny,
                            toBeDoubled: false
                        });
                    }
                    else {
                        if (this.tiles[x][ny - 1].value == this.tiles[x][y].value && !this.tiles[x][ny - 1].isMixed) {
                            this.tiles[x][ny - 1] = new Tile(this.tileSize, x, ny - 1, this.offset, parseInt(value) * 2);
                            this.tiles[x][ny - 1].hasMoved = true;
                            this.tiles[x][ny - 1].isMixed = true;
                            this.tiles[x][ny - 1].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: x,
                                ny: ny - 1,
                                toBeDoubled: true
                            });
                        }
                    }
                }
            }
        }
    }
    this.animateTiles(changedTiles, 1, _tile);
};

Two048.prototype.moveDown = function (_tile) {
    var changedTiles = [];
    for (var y = this.n - 2; y >= 0; y--) {
        for (var x = 0; x < this.n; x++) {
            if (this.tiles[x][y]) {
                if (!this.tiles[x][y].hasMoved) {
                    var tile = this.tiles[x][y];
                    var value = tile.value;
                    var ny = y + 1;

                    while (!this.tiles[x][ny] && ny < this.n - 1)
                        ny++;

                    if (this.tiles[x][ny] && ny != y)
                        ny--;

                    if (ny + 1 < this.n && ny != y) {
                        if (this.tiles[x][ny + 1].value == this.tiles[x][y].value && !this.tiles[x][ny + 1].isMixed) {
                            this.tiles[x][ny + 1] = new Tile(this.tileSize, x, ny + 1, this.offset, parseInt(value) * 2);
                            this.tiles[x][ny + 1].hasMoved = true;
                            this.tiles[x][ny + 1].isMixed = true;
                            this.tiles[x][ny + 1].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: x,
                                ny: ny + 1,
                                toBeDoubled: true
                            });
                        }
                        else {
                            this.tiles[x][ny] = new Tile(this.tileSize, x, ny, this.offset, value);
                            this.tiles[x][ny].hasMoved = true;
                            this.tiles[x][ny].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: x,
                                ny: ny,
                                toBeDoubled: false
                            });
                        }
                    } else if (ny != y) {
                        this.tiles[x][ny] = new Tile(this.tileSize, x, ny, this.offset, value);
                        this.tiles[x][ny].hasMoved = true;
                        this.tiles[x][ny].toBeDrawn = false;
                        this.tiles[x][y] = null;
                        changedTiles.push({
                            x: x,
                            y: y,
                            nx: x,
                            ny: ny,
                            toBeDoubled: false
                        });
                    }
                    else {
                        if (this.tiles[x][ny + 1].value == this.tiles[x][y].value && !this.tiles[x][ny + 1].isMixed) {
                            this.tiles[x][ny + 1] = new Tile(this.tileSize, x, ny + 1, this.offset, parseInt(value) * 2);
                            this.tiles[x][ny + 1].hasMoved = true;
                            this.tiles[x][ny + 1].isMixed = true;
                            this.tiles[x][ny + 1].toBeDrawn = false;
                            this.tiles[x][y] = null;
                            changedTiles.push({
                                x: x,
                                y: y,
                                nx: x,
                                ny: ny + 1,
                                toBeDoubled: true
                            });
                        }
                    }
                }
            }
        }
    }
    this.animateTiles(changedTiles, 3, _tile);
};

