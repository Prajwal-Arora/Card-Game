const express = require('express');
const app = express();
const port = 3003;
const path = require('path');
const mongoose = require('./database');

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, { pingTimeout: 60000 });

io.on("connection", socket => {
    console.log('Connected!!');
})