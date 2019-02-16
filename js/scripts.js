var startX, startY, stopX, stopY;
var minDelta = 10;
var values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");
var w = parseInt(window.innerWidth * 0.9);
var h = parseInt(window.innerHeight * 0.9);
var canvasSize = w > h ? h - 200 : w;
var scaleFactor = 3;
var theLog = document.getElementById("theLog");

canvas.style.height = canvasSize + "px";
canvas.height = scaleFactor * canvasSize;
canvas.width = scaleFactor * canvasSize;


var game = new Two048(canvas, 4, db);

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


function animate(func, callback, duration) {
    var count = 0;

    if (count < duration)
        requestAnimationFrame(anim);

    function anim() {
        func();
        count++;

        if (count < duration)
            requestAnimationFrame(anim);
        else
            callback();
    }
}


function random(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
}

canvas.onclick = function () {
    // if(game.isPaused){
    // 	game.start();
    // }
};

var touched = false;
var count = 0;
window.onmousedown = function () {
    touched = true;
};

window.onmouseup = function () {
    touched = false;
    count = 0;
};

var myElement = document.getElementById("theGame");

var mc = new Hammer(myElement);

//enable all directions
mc.get('swipe').set({
    direction: Hammer.DIRECTION_ALL,
    threshold: 1,
    velocity: 0.1
});

// listen to events...
mc.on("swipeup swipedown swipeleft swiperight", move);

window.onkeyup = move;

function move(e) {
	if (!game.isReady)
		return;

	if(!game.myTurn)
		return;

    console.log(game.myTurn)

	if (e.key == "ArrowUp") {
		game.myMove = true;
		game.moveUp();
	}
	else if (e.key == "ArrowRight") {
		game.myMove = true;
		game.moveRight();
	}
	else if (e.key == "ArrowDown") {
		game.myMove = true;
		game.moveDown();
	}
	else if (e.key == "ArrowLeft") {
		game.myMove = true;
		game.moveLeft();
	}
};

$(document).ready(function () {
    // $(window).on("beforeunload", function(e){
    // e.returnValue = "Do you really want to exit?";
    //     return "Do you really want to exit?";
    // });
});

startGame();

function startGame() {
    $.getJSON('https://json.geoiplookup.io/api?callback=?', function (data) {
        var ip = data["ip"];
        console.log(ip)
        var href = document.location.href;
        var oppIp = href.substr(href.lastIndexOf("=") + 1);
        game.isReady = false;
        var gameRef = db.collection('games').doc(ip + "-" + oppIp);

        gameRef.get()
            .then(doc => {
                if (!doc.exists) {
                    gameRef = db.collection('games').doc(oppIp + "-" + ip);
                    gameRef.get()
                        .then(doc => {
                            if (!doc.exists) {
                                gameRef = db.collection('games').doc(ip + "-" + oppIp);
                                gameRef.set({
                                    playerOne: ip,
                                    playerTwo: oppIp,
                                    game: JSON.stringify(game.tiles),
									lastTurnBy: ""
                                }).then(function () {
                                    console.log("Game created..");
                                    _startGame(game.tiles, ip + "-" + oppIp, ip, true);
                                }).catch(function (error) {
                                    console.error("Error adding document: ", error);
                                });
                            } else {
                                console.log("Game fetched..");
                                _startGame(JSON.parse(doc.data().game), doc.id, ip, false);
                            }
                        })
                        .catch(err => {
                            console.log('Error getting document', err);
                        });
                } else {
                    console.log("Game fetched..", doc.data().lastTurnBy != ip);
                    _startGame(JSON.parse(doc.data().game), doc.id, ip, doc.data().lastTurnBy != ip);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    });

    function _startGame(_game, id, ip, myTurn) {
        game.tiles = [];
        game.setTiles(_game);
        game.draw();
        game.id = id;
        game.isReady = true;
        game.myIp = ip;
        game.myTurn = myTurn;
        console.log(game.myTurn);
        game.listenForMoves();
    }
}
