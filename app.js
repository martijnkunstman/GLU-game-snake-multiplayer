const express = require('express')
const app = express()
const port = 3000;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static('public'))

const socket = require('socket.io')
const io = socket(server)

io.on('connection', newConnection)

function newConnection(socket) {
    console.log("newConnection" + socket.id)
    socket.on("tick", tick)
    function tick(data) {
        socket.broadcast.emit('tick', data);
        console.log(data);
    }
}

