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
  if (req.path.startsWith("/api")) {
    next();
  } else {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  }
});

// Setup routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/database", require("./routes/database")); // TODO: Rename to data
app.use("/api/iot", require("./routes/iot")); // TODO: Rename to streaming

// Begin Server
const protocol = http.createServer(app);
protocol.listen(process.env.GATEWAY_PORT, () =>
  console.log(`Listening on port ${process.env.GATEWAY_PORT}`)
);

// Server and client sockets for socket-io data proxy
const io = require("socket.io")(protocol, {
  cors: {
    origin: "http://localhost:3000", // CHANGE WHEN DEPLOYING
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket authentication and handler
// TODO: Handle reconnection
const { isTokenValid, isApiKeyValid } = require("./middleware/auth");
io.use((socket, next) => {
  let token = "";
  const parseCookie = (str) =>
    str
      .split(";")
      .map((v) => v.split("="))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
  if (socket.handshake.headers.cookie)
    token = parseCookie(socket.handshake.headers.cookie)["Authorization"];
  if (token && isTokenValid(token)) {
    next();
  } else {
    const apiKey = socket.request.headers.key;
    if (apiKey && isApiKeyValid(apiKey)) {
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
