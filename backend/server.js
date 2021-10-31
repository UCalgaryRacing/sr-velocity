"use strict";

// Set up env
require("dotenv").config();

// Library Imports
const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const io = require("socket.io")(process.env.REACT_SOCKETIO_PORT);
const socketIOClient = require("socket.io-client");

// SocketIO
const socket = socketIOClient(
  "http://" + process.env.DATA_API_MS_IP + ":" + process.env.DATA_API_SOCKETIO,
  {
    reconnection: true,
  }
);

// Forward incoming data to React
socket.on("new data", (data) => {
  io.emit(data);
});

// Express Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "xCufvwEyu14Tuu7l",
    resave: true,
    saveUninitialized: true,
    secure: true,
  })
);
app.use(cookieParser());

// All routes except those starting with /api/ should serve web pages
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.get(new RegExp("(?!/api/).+"), (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// Import Routes
const sensor = require("./routes/sensor");

// Setup Routes
app.use("/sensor", sensor);

// Begin Server
app.listen(process.env.GATEWAY_PORT, () =>
  console.log(`Listening on port ${process.env.GATEWAY_PORT}`)
);
