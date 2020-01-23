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
  ctx.lineWidth = 20;
  // draw food
  if (food != "") {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(food.y * multiplier - 0.1, food.x * multiplier - 0.1);
    ctx.lineTo(food.y * multiplier, food.x * multiplier);
    ctx.stroke();
  }
  // draw all snakes
  for (var i = 0; i < gameData.length; i++) {
    ctx.beginPath();
    //draw a snake
    if (gameData[i].id == socket.id) {
      ctx.strokeStyle = "green";
    }
    else {
      ctx.strokeStyle = "red";
    }
    var xadd = 0;
    var yadd = 0
    var difference = multiplier * ((gameData[i].time - data[2]) / gameData[i].speed);

    for (var j = 0; j < gameData[i].snake.length; j++) {
      var newX = gameData[i].snake[j].x;
      var newY = gameData[i].snake[j].y;
      if (j == 0) {
        var xadd = 0;
        var yadd = 0
        if (gameData[i].snake.length > 1) {
          if (gameData[i].snake[0].x == gameData[i].snake[1].x) {
            if (gameData[i].snake[0].y < gameData[i].snake[1].y) {
              yadd = - difference;
            }
            else {
              yadd = difference;
            }
          }
          else {
            if (gameData[i].snake[0].x < gameData[i].snake[1].x) {
              xadd = - difference;
            }
            else {
              xadd = difference;
            }
          }
        }
        ctx.moveTo(newY * multiplier - 0.1 + yadd, newX * multiplier - 0.1 + xadd);
        ctx.lineTo(newY * multiplier + yadd, newX * multiplier + xadd);
      }
      else {
        var xadd = 0;
        var yadd = 0
        if (j == gameData[i].snake.length-1)
        {
          if (gameData[i].direction == 1)
          {
            yadd = difference
          }
          if (gameData[i].direction == 2)
          {
            yadd = -difference
          }
          if (gameData[i].direction == 3)
          {
            xadd = difference
          }
          if (gameData[i].direction == 4)
          {
            xadd = -difference
          }
        }
        if ((Math.abs(oldX - newX) > 1) || (Math.abs(oldY - newY) > 1)) {
          ctx.stroke();
          ctx.moveTo(newY * multiplier + yadd, newX * multiplier + xadd);
        }
        else {
          ctx.lineTo(newY * multiplier + yadd, newX * multiplier + xadd);
        }
      }
      var oldX = gameData[i].snake[j].x;
      var oldY = gameData[i].snake[j].y;
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