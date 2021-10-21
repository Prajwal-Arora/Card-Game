const express = require('express');
const app = express();
const port = 3003;
const path = require('path');
const mongoose = require('./database');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, { 
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {
    console.log('Socket connected!!');

    socket.on("join room", data => {
        socket.join(data, () => {
            console.log("room created for " + data);
        });
    })

})

io.on('connection', socket => {
    socket.on('join', (payload, callback) => {
        let numberOfUsersInRoom = getUsersInRoom(payload.room).length

        const { error, newUser} = addUser({
            id: socket.id,
            name: numberOfUsersInRoom===0 ? 'Player 1' : 'Player 2',
            room: payload.room
        })

        if(error)
            return callback(error)

        socket.join(newUser.room)

        io.to(newUser.room).emit('roomData', {room: newUser.room, users: getUsersInRoom(newUser.room)})
        socket.emit('currentUserData', {name: newUser.name})
        callback()
    })
})