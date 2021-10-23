const express = require('express');
const app = express();
const port = 3003;
const path = require('path');
const cors = require('cors')
const { instrument } = require('@socket.io/admin-ui');
// const mongoose = require('./database');
//const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

app.use(cors());

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, { 
    cors: {
        origin: ["http://localhost:3000", "https://admin.socket.io/"]
    }
});

const users = [];

io.on("connection", socket => {
    console.log(socket.id);

    socket.on("join", data => {
        console.log(data)
    })

})

instrument(io, { auth: false })
