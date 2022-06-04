// Copyright Schulich Racing, FSAE
// Written By Justin Tijunelis

// Set up environment
require("dotenv").config();

// Library imports
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const http = require("http");

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
  if (req.path.startsWith("/api/")) {
    next();
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  }
});

// Setup routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/database", require("./routes/database"));
app.use("/api/iot", require("./routes/iot"));

// Begin Server
const protocol = http.createServer(app);
protocol.listen(process.env.GATEWAY_PORT);
console.log(`Listening on port ${process.env.GATEWAY_PORT}`);

// Server and client sockets for socket-io data proxy
const io = require("socket.io")(protocol, {
  cors: {
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket authentication and handler
// TODO: Handle reconnection
const { isCookieValid, isApiKeyValid } = require("./middleware/auth");
io.use(async (socket, next) => {
  const cookieValid = await isCookieValid(socket.handshake.headers.cookie);
  if (cookieValid) {
    next();
  } else {
    const keyValid = await isApiKeyValid(socket.request.headers.key);
    if (keyValid) {
      next();
    } else {
      const err = new Error("Not authorized.");
      err.status = 401;
      next(err);
    }
  }
}).on("connection", (socket) => {
  const handleSocketSession = require("./streaming/socket-io-routes");
  handleSocketSession(io, socket);
});
