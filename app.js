const express = require('express')
const app = express()
const port = 3000;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static('public'))

const socket = require('socket.io')
const io = socket(server)

let gameData = []
let gridSize = 12;

io.on('connection', newConnection)

function newConnection(socket) {
    gameData.push({"id":socket.id,"direction": 0, "snake": []});
    console.log("newConnection:" + socket.id)
    socket.emit('init',gridSize)
    socket.on('disconnect', function() {
        console.log('Got disconnect!') 
        listToDelete = [socket.id]
        gameData = gameData.filter( el => (-1 == listToDelete.indexOf(el.id)))
        console.log(gameData)
        io.emit('gameData', gameData)
     });

     socket.on('direction', function(direction){
        console.log('id:' + socket.id)
        console.log('direction: ' + direction)
        gameData.find(x => x.id === socket.id).direction = direction
        console.log(gameData)
        io.emit('gameData', gameData)        
     });
}

function init()
{

}

