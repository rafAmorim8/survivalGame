let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let middle = 300;
let x = middle;
let y = middle;
let height = 60;
let width = 35;


function drawObject(x, y){
	ctx.save();
	ctx.beginPath();
	ctx.lineTo(x,y);
	ctx.lineTo(x + width, y + height);
	ctx.lineTo(x - width, y + height);
	ctx.lineTo(x,y);
	ctx.stroke();
	ctx.fill();
	ctx.restore();	
}

function reset(){
	ctx.clearRect(0, 0, 600, 600);
	x = middle;
	y = middle;
	drawObject(x, y);
}

function redraw(){
	ctx.clearRect(0, 0, 600, 600);
	drawObject(x, y);
}

function moveUp() {
	if(y >= 10){
		y -= 10;
	}else{
		y = 0;
	}
	redraw();
}

function moveDown() {
	if(y <= 590 - height){
		y += 10;
	}else{
		y = 600 - height;
	}
	redraw();
}

function moveLeft() {
	if(x >= 10 + width){
		x -= 10;
	}else{
		x = width;
	}
	redraw();
}

function moveRight() {
	if(x <= 590 - width){
		x += 10;
	}else{
		x = 600 - width;
	}
	redraw();
}

drawObject(x, y);
