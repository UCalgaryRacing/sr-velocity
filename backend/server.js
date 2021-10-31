"use strict";

// Set up env
require("dotenv").config();

// Library Imports
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const socketIOClient = require("socket.io-client");

// Express Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All routes except those starting with /api/ should serve web pages
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.get(new RegExp("(?!/api/).+"), (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// Setup Routes
const database = require("./routes/database");
app.use("/api/database", database);
const data = require("./routes/data");
app.use("/api/data", data);
const iot = require("./routes/iot");
app.use("/api/iot", iot);

// Server and client sockets for proxy socket io data forwarding
const io = require("socket.io")(process.env.CLIENT_SOCKET_PORT);
const socket = socketIOClient(process.env.DATA_API_SOCKET_ROUTE, {
  reconnection: true,
});

// Forward incoming data to appropriate clients
socket.on("new data", (data) => {
  // TODO: Read key and only emit to "rooms" that are associated with the incoming data
  io.emit(data);
});

// Begin Server
app.listen(process.env.GATEWAY_PORT, () =>
  console.log(`Listening on port ${process.env.GATEWAY_PORT}`)
);
