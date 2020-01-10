const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static('public'))

const socket = require('socket.io')
const io = socket(server)

let gameData = []
let food = "";
let initialSnakeSpeed = 200;
let snakeSpeedGrow = 20;
let snakeSpeedMin = 100;
let time = new Date().getTime();
const gridSize = 16
const speed = 1000 / 60;

io.on('connection', newConnection)

function newConnection(socket) {
   gameData.push({ "id": socket.id, "time": time, "speed": initialSnakeSpeed, "direction": 0, "length": 1, "snake": [getRandomEmptyPosition()] });
   //console.log("newConnection:" + socket.id)
   socket.emit('init', gridSize)
   socket.on('disconnect', function () {
      //console.log('Got disconnect!')
      listToDelete = [socket.id]
      gameData = gameData.filter(el => (-1 == listToDelete.indexOf(el.id)))
      //console.log(gameData)
   });

   socket.on('direction', function (direction) {
      //console.log('id:' + socket.id)
      //console.log('direction: ' + direction)
      gameData.find(x => x.id === socket.id).direction = direction
   });
}

function tick() {
   time = new Date().getTime();
   //update snake positions
   for (var i = 0; i < gameData.length; i++) {


      if (time - gameData[i].time > gameData[i].speed) {
         //update snake position only if time difference is bigger than snake speed
         currentX = gameData[i].snake[gameData[i].snake.length - 1].x;
         currentY = gameData[i].snake[gameData[i].snake.length - 1].y;
         currentDirection = gameData[i].direction;
         if (currentDirection == 1) {
            currentY--;
            if (currentY < 0) {
               currentY = gridSize - 1;
            }
         }
         if (currentDirection == 2) {
            currentY++;
            if (currentY > gridSize - 1) {
               currentY = 0;
            }
         }
         if (currentDirection == 3) {
            currentX--;
            if (currentX < 0) {
               currentX = gridSize - 1;
            }
         }
         if (currentDirection == 4) {
            currentX++;
            if (currentX > gridSize - 1) {
               currentX = 0;
            }
         }
         gameData[i].snake.push({ "x": currentX, "y": currentY });
         gameData[i].time = time;
         if (gameData[i].snake.length > gameData[i].length) {
            gameData[i].snake.shift();
         }
      }
   }
   // set food
   if (food == "") {
      food = getRandomEmptyPosition();
   }
   // check food
   for (var i = 0; i < gameData.length; i++) {
      if (gameData[i].snake[gameData[i].snake.length - 1].x == food.x && gameData[i].snake[gameData[i].snake.length - 1].y == food.y) {
         food = getRandomEmptyPosition();
         gameData[i].length++;
         gameData[i].speed = gameData[i].speed - snakeSpeedGrow;
         if (gameData[i].speed < snakeSpeedMin) {
            gameData[i].speed = snakeSpeedMin;
         }
         break;
      }
   }

   //emit gameData
   io.emit('gameData', [gameData, food, time])
   setTimeout(tick, speed);
}
tick();

function getRandomEmptyPosition() {
   //
   let place = [];
   for (let a = 0; a < gridSize; a++) {
      for (let b = 0; b < gridSize; b++) {
         place.push({ "x": a, "y": b });
         for (let c = 0; c < gameData.length; c++) {
            for (let d = 0; d < gameData[c].snake.length; d++) {
               if (gameData[c].snake[d].x == a && gameData[c].snake[d].y == b) {
                  place.pop();
               }
            }
         }
         if (food != "") {
            if (food.x == a && food.y == b) {
               place.pop();
            }
         }
      }
   }
   //bug/check when no places are left...
   return place[Math.floor(Math.random() * place.length)];
}

