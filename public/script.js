let gridsize;
let socket;
socket = io.connect('http://localhost:3000');
socket.on("init", init);
function init(data) {
  gridsize = data;
  createGrid();
}

socket.on("gameData", render);
function render(data) {
  // clear all cells
  let cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].className = "cell";
  }
  // draw all snakes
  for (var i = 0; i < data.length; i++) {
    //draw a snake
    for (var j = 0; j < data.snake[i].length; j++) {
      document.getElementById("pos-"+snake[i][j].x+"-"+snake[i][j].y).classList.add("body");
    }
  }
}

//------------------------------------
function createGrid() {
  let br = document.createElement("br");
  for (let a = 0; a < gridsize; a++) {
    for (let b = 0; b < gridsize; b++) {
      let cell = document.createElement("div");
      cell.setAttribute("id", "pos-" + a + "-" + b);
      cell.setAttribute("class", "cell");
      document.body.appendChild(cell);
    }
    let br = document.createElement("br");
    document.body.appendChild(br);
  }
}

//------------------------------------
document.addEventListener("keydown", keydown);
function keydown(e) {
  olddirection = direction;
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
  if (olddirection != direction) {
    socket.emit('direction', direction);
  }
}


//------------------------------------
// to server
//------------------------------------
function tick() {
  // set position
  if (direction == 1) {
    posy--;
    if (posy < 0) {
      posy = gridsize - 1;
    }
  }
  if (direction == 2) {
    posy++;
    if (posy > gridsize - 1) {
      posy = 0;
    }
  }
  if (direction == 3) {
    posx--;
    if (posx < 0) {
      posx = gridsize - 1;
    }
  }
  if (direction == 4) {
    posx++;
    if (posx > gridsize - 1) {
      posx = 0;
    }
  }
  let element = "0";
  if (directionOld != direction) {
    if (direction == 1) {
      if (directionOld == 3) {
        element = "c";
      }
      if (directionOld == 4) {
        element = "b";
      }
    }
    if (direction == 2) {
      if (directionOld == 3) {
        element = "a";
      }
      if (directionOld == 4) {
        element = "d";
      }
    }
    if (direction == 3) {
      if (directionOld == 1) {
        element = "n";
      }
      if (directionOld == 2) {
        element = "l";
      }
    }
    if (direction == 4) {
      if (directionOld == 1) {
        element = "k";
      }
      if (directionOld == 2) {
        element = "m";
      }
    }
  } else {
    if (direction == 1) {
      element = "v";
    }
    if (direction == 2) {
      element = "w";
    }
    if (direction == 3) {
      element = "h";
    }
    if (direction == 4) {
      element = "i";
    }
  }
  poshistory.push([posy + "-" + posx, element]);
  directionOld = direction;

  if (food == "") {
    setNewFood();
  }
  // clear all cells
  let cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].className = "cell";
  }
  // create snake
  for (let i = 0; i < poshistory.length; i++) {
    document.getElementById(poshistory[i][0]).classList.add("body");
    if (i == 0) {
      if (poshistory.length > 1) {
        if (
          poshistory[i + 1][1] == "a" ||
          poshistory[i + 1][1] == "d" ||
          poshistory[i + 1][1] == "w"
        ) {
          document.getElementById(poshistory[i][0]).classList.add("e");
        }
        if (
          poshistory[i + 1][1] == "b" ||
          poshistory[i + 1][1] == "c" ||
          poshistory[i + 1][1] == "v"
        ) {
          document.getElementById(poshistory[i][0]).classList.add("f");
        }
        if (
          poshistory[i + 1][1] == "k" ||
          poshistory[i + 1][1] == "m" ||
          poshistory[i + 1][1] == "i"
        ) {
          document.getElementById(poshistory[i][0]).classList.add("g");
        }
        if (
          poshistory[i + 1][1] == "l" ||
          poshistory[i + 1][1] == "n" ||
          poshistory[i + 1][1] == "h"
        ) {
          document.getElementById(poshistory[i][0]).classList.add("j");
        }
      } else {
        document.getElementById(poshistory[i][0]).classList.add("r");
      }
      document.getElementById(poshistory[i][0]).classList.add(poshistory[i][1]);
    } else {
      if (i < poshistory.length - 1) {
        document
          .getElementById(poshistory[i][0])
          .classList.add(poshistory[i + 1][1]);
      } else {
        if (direction == 1) {
          document.getElementById(poshistory[i][0]).classList.add("e");
        }
        if (direction == 2) {
          document.getElementById(poshistory[i][0]).classList.add("f");
        }
        if (direction == 3) {
          document.getElementById(poshistory[i][0]).classList.add("g");
        }
        if (direction == 4) {
          document.getElementById(poshistory[i][0]).classList.add("j");
        }
      }
    }
  }
  // check snake collision
  for (let i = 0; i < poshistory.length - 1; i++) {
    if (poshistory[i][0] == posy + "-" + posx) {
      document.getElementById(poshistory[i][0]).classList.add("food");
    }
  }

  // check food collision
  if (food == posy + "-" + posx) {
    snakelength++;
    speed = speed - 5;
    if (speed < 100) {
      speed = 100;
    }
    setNewFood();
  } else {
    if (poshistory.length > snakelength) {
      poshistory.shift();
    }
  }
  document.getElementById(food).classList.add("food");

  setTimeout(tick, speed);
}

function setNewFood() {
  let place = [];
  for (let a = 0; a < gridsize; a++) {
    for (let b = 0; b < gridsize; b++) {
      place.push(a + "-" + b);
      for (let c = 0; c < poshistory.length; c++) {
        if (poshistory[c][0] == a + "-" + b) {
          place.pop();
          //break;
        }
      }
    }
  }
  food = place[Math.floor(Math.random() * place.length)];
}


//------------------------------------