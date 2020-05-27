var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");

var kernel_w = 10;
var kernel_h = 10;

var width = canvas.width/kernel_w;
var height = canvas.height/kernel_h;

var buffer1 = [];
var buffer2 = [];

function fillBuffer(buffer) {
  for (var i=0;i<width;i++) {
    buffer.push([]);
    for (var j=0;j<height;j++) {
      var startColor = (Math.random() * 95 < 100) ? "Black" : "White";
      buffer[i].push(startColor);
    }
  }
}

fillBuffer(buffer1);
fillBuffer(buffer2);

//buffer1[30][30] = "Black";
//buffer1[29][31] = "Black";
//buffer1[31][31] = "Black";
//buffer1[32][30] = "Black";
//buffer1[28][30] = "Black";

function color(x,y) {
  buffer1[x][y] = "Black";
}

function ball(x,y) {
  color(x,y+1);
  color(x+1,y);
  color(x+1,y+1);
  color(x,y);
}

function spaceship(x,y) {
  color(x,y);
  color(x,y+1);
  color(x,y-1);

  color(x+1,y+2);
  color(x+1,y-2);

  color(x+2,y+3);
  color(x+2,y-3);

  color(x+3,y+3);
  color(x+3,y-3);

  color(x+4,y);

  color(x+5,y+2);
  color(x+5,y-2);

  color(x+6,y);
  color(x+6,y+1);
  color(x+6,y-1);

  color(x+7,y);
}

function eyebrows(x,y) {
  color(x,y);
  color(x,y+1);
  color(x,y-1);

  color(x+1,y);
  color(x+1,y+1);
  color(x+1,y-1);

  color(x+2,y+2);
  color(x+2,y-2);

  color(x+4,y+2);
  color(x+4,y-2);
  color(x+4,y+3);
  color(x+4,y-3);
}

function shipGenerator(x,y) {
  ball(x,y);
  spaceship(x+10,y+1);
  eyebrows(x+20,y-1);
  ball(x+34,y-2);
}

//shipGenerator(10,10);
//shipGenerator(15,40)

current_buffer = buffer1;
prev_buffer = buffer2;

function nbrOfAliveNeighbours(x,y,from) {
  var aliveNeighbours = 0;
  for (var i=-1; i<2;i++) {
    for (var j=-1; j<2;j++) {
      if (i==0 && j==0) {
        continue;
      }
      if (x+i<0 || x+i>=width || y+i<0 || y+i>=height) {
        continue;
      }
      aliveNeighbours += from[x+i][y+j] == "Black";
    }
  }

  return aliveNeighbours;
}

function colorMyKernel(x,y,from,to) {
  isAlive = from[x][y] == "Black";

  aliveNeighbours = nbrOfAliveNeighbours(x,y,from);

  // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  if (isAlive && aliveNeighbours < 2) {
    to[x][y] = "White";
  } else if (isAlive && aliveNeighbours >= 2 && aliveNeighbours < 4) {
    // Any live cell with two or three live neighbours lives on to the next generation.
    to[x][y] = "Black";
  } else if (isAlive && aliveNeighbours > 3) {
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    to[x][y] = "White";
  } else if (!isAlive && aliveNeighbours == 3) {
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    to[x][y] = "Black";
  } else {
    to[x][y] = "White";
  }
}

function draw() {

  // Draw the current game board.
  for (var x=0; x<height; x++) {
    for (var y=0; y<width; y++) {
			ctx.fillStyle = current_buffer[x][y];
      ctx.fillRect(x*kernel_w,y*kernel_h,kernel_w,kernel_h);
    }
  }
}

function update() {
  // Updates the previous game board.
  for (var x=0; x<height; x++) {
    for (var y=0; y<width; y++) {
      colorMyKernel(x,y,current_buffer,prev_buffer);
    }
  }
}

function gameLoop() {
  draw();
  update();

  if (current_buffer == buffer1) {
    current_buffer = buffer2;
    prev_buffer = buffer1;
  } else {
    current_buffer = buffer1;
    prev_buffer = buffer2;
  }
}

setInterval(gameLoop, 100);
