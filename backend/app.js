// Copyright Schulich Racing, FSAE

"use strict";

// Set up env
require("dotenv").config();

// Library imports
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const socketIOClient = require("socket.io-client");

// Express configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All routes except those starting with /api/ should serve web pages
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.all("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  }
});

// Setup routes
const database = require("./routes/database");
const data = require("./routes/data");
const iot = require("./routes/iot");
app.use("/api/database", database);
app.use("/api/data", data);
app.use("/api/iot", iot);
app.use("/api/auth", require("./routes/auth"));

// // Server and client sockets for socket-io data proxy
// const io = require("socket.io")(process.env.CLIENT_SOCKET_PORT);
// const socket = socketIOClient(process.env.DATA_API_SOCKET_ROUTE, {
//   reconnection: true,
// });

// // Forward incoming data to appropriate clients
// socket.on("new data", (data) => {
//   // TODO: Read key and only emit to "rooms" that are associated with the incoming data
//   io.emit(data);
// });

// Begin Server
app.listen(process.env.GATEWAY_PORT, () =>
  console.log(`Listening on port ${process.env.GATEWAY_PORT}`)
);
