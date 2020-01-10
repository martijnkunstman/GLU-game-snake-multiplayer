let gridsize;
let socket;
let gameData;
let food;
let direction;
//--------------------------------------
socket = io.connect('http://localhost:8080');
//--------------------------------------
socket.on("init", init);
function init(data) {
  gridsize = data;
  createGrid();
}
//--------------------------------------
socket.on("gameData", render);
function render(data) {
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
      if (gameData[i].id==socket.id)    
      {
        document.getElementById("pos-" + gameData[i].snake[j].y + "-" + gameData[i].snake[j].x).classList.add("green");
      }
    }
  }
}

//------------------------------------
function createGridNew() {

}

//------------------------------------

function createGrid() {
  let br = document.createElement("br");
  for (let a = 0; a < gridsize; a++) {
    for (let b = 0; b < gridsize; b++) {
      let cell = document.createElement("div");
      cell.setAttribute("id", "pos-" + a + "-" + b);
      cell.setAttribute("class", "cell");
      document.getElementById("game").appendChild(cell);
    }
    let br = document.createElement("br");
    document.getElementById("game").appendChild(br);
  }
  document.addEventListener("keydown", keydown);
}

//------------------------------------

function keydown(e) {
  if (e.code == "ArrowUp") {
    direction = 1;
  }
  if (e.code == "ArrowDown") {
    direction = 2;
  }
  if (e.code == "ArrowLeft") {
    direction = 3;
  }
  if (e.code == "ArrowRight") {
    direction = 4;
  }
  socket.emit('direction', direction);
}

//------------------------------------