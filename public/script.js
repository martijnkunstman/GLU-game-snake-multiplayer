let gridsize;
let socket;
let gameData;
let food;
let direction;
//--------------------------------------
socket = io.connect();
//--------------------------------------
socket.on("init", init);
function init(data) {
  gridsize = data;
  document.addEventListener("keydown", keydown);
}
//--------------------------------------
socket.on("gameData", render);

function render(data) {
  gameData = data[0];
  food = data[1];
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  // clear canvas
  ctx.clearRect(0, 0, c.width, c.height);
  var multiplier = 10;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 10;
  // draw food
  if (food != "") {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(food.y*multiplier-0.1, food.x*multiplier-0.1);
    ctx.lineTo(food.y*multiplier, food.x*multiplier);
    ctx.stroke();
  }
  // draw all snakes
  for (var i = 0; i < gameData.length; i++) {
    ctx.beginPath();
    //draw a snake
    for (var j = 0; j < gameData[i].snake.length; j++) {

      if (gameData[i].id == socket.id) {
        ctx.strokeStyle = "green";
      }
      else{
        ctx.strokeStyle = "red";
      }
      if (j == 0)
      {
        ctx.moveTo(gameData[i].snake[j].y*multiplier-0.1, gameData[i].snake[j].x*multiplier-0.1);
        ctx.lineTo(gameData[i].snake[j].y*multiplier, gameData[i].snake[j].x*multiplier);
      }
      else{
        ctx.lineTo(gameData[i].snake[j].y*multiplier, gameData[i].snake[j].x*multiplier);
      }
    }
    ctx.stroke();
  } 
}


function render2(data) {
  gameData = data[0];
  food = data[1];
  // clear all cells
  let cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].className = "cell";
  }
  // draw food
  if (food != "") {
    document.getElementById("pos-" + food.y + "-" + food.x).classList.add("food");
  }
  // draw all snakes
  for (var i = 0; i < gameData.length; i++) {
    //draw a snake
    for (var j = 0; j < gameData[i].snake.length; j++) {
      document.getElementById("pos-" + gameData[i].snake[j].y + "-" + gameData[i].snake[j].x).classList.add("body");
      if (gameData[i].id == socket.id) {
        document.getElementById("pos-" + gameData[i].snake[j].y + "-" + gameData[i].snake[j].x).classList.add("green");
      }
    }
  }
}



//------------------------------------

function keydown(e) {
  if (e.code == "ArrowUp") {
    direction = 3;
  }
  if (e.code == "ArrowDown") {
    direction = 4;
  }
  if (e.code == "ArrowLeft") {
    direction = 1;
  }
  if (e.code == "ArrowRight") {
    direction = 2;
  }
  socket.emit('direction', direction);
}

document.getElementById("up").addEventListener("mousedown", function () { direction = 3; socket.emit('direction', direction); });
document.getElementById("down").addEventListener("mousedown", function () { direction = 4; socket.emit('direction', direction); });
document.getElementById("left").addEventListener("mousedown", function () { direction = 1; socket.emit('direction', direction); });
document.getElementById("right").addEventListener("mousedown", function () { direction = 2; socket.emit('direction', direction); });

document.getElementById("up").addEventListener("touchstart", function () { direction = 3; socket.emit('direction', direction); });
document.getElementById("down").addEventListener("touchstart", function () { direction = 4; socket.emit('direction', direction); });
document.getElementById("left").addEventListener("touchstart", function () { direction = 1; socket.emit('direction', direction); });
document.getElementById("right").addEventListener("touchstart", function () { direction = 2; socket.emit('direction', direction); });

//------------------------------------