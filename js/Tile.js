function Tile(size, x, y, margin, value){
    this.size = size;
    this.x = x;
    this.y = y;
    this.offX = 0;
    this.offY = 0;
    this.margin = margin;
    // this.offset = 5*scaleFactor;
    this.fillStyle = "white";
    this.hasMoved = false;
    if(value)
        this.value = value;
    else
        this.value = values[random(0, 2)];
}

Tile.prototype.plusX = function(x){
    this.offX += x;
};

Tile.prototype.plusY = function(y){
    this.offY += y;
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

    var x = this.x*(this.size+this.margin) + this.offX + this.margin;
    var y = this.y*(this.size+this.margin) + this.offY + this.margin;
    var size = this.size;
    ctx.fillRect(x, y, size, size);
    ctx.font="1000 "+(scaleFactor*30)+"px Aerial";
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#424242";

    ctx.fillText(this.value ,x+(size/2),y+(size/2));
    ctx.restore();

};