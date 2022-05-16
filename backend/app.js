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
app.use("/api/database", require("./routes/database"));
app.use("/api/data", require("./routes/data"));
app.use("/api/iot", require("./routes/iot"));
app.use("/api/auth", require("./routes/auth"));

// Begin Server
const protocol = http.createServer(app);
protocol.listen(process.env.GATEWAY_PORT, () =>
  console.log(`Listening on port ${process.env.GATEWAY_PORT}`)
);

// Server and client sockets for socket-io data proxy
const initializeSocketRoutes = require("./streaming/socket-io-routes");
const io = require("socket.io")(protocol, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket authentication
const { isTokenValid, isApiKeyValid } = require("./middleware/auth");
io.use((socket, next) => {
  let token = "";
  if (socket.request.headers.cookie)
    token = socket.request.headers.cookie.idToken;
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
  initializeSocketRoutes(io, socket);
});
