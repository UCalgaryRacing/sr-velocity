// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

const { isNewRoomSecretValid } = require("../middleware/auth");

let roomCollection = {};
let queuedUsers = {};

const handleSocketSession = (io, socket) => {
  console.log("handling socket session");
  let currentConnection = { room: undefined };

  /**
   * Emitted by the streaming service. Blocked by any other emissions.
   * When the room is created, all queued users will be notified.
   */
  socket.on("new room", (credentials) => {
    console.log("new room", credentials);
    if (isNewRoomSecretValid(credentials.secret)) {
      console.log("new room secret valid")
      roomCollection[credentials.thingId] = { creatorId: socket.id };
      currentConnection.room = credentials.thingId;
      socket.join(credentials.thingId);
      if (queuedUsers[credentials.thingId]) {
        for (const queuedUser of queuedUsers[credentials.thingId]) {
          queuedUser.socket.join(credentials.thingId);
          queuedUser.socket.emit("joined room");
        }
        delete queuedUsers[credentials.thingId];
      }
      socket.emit("room created");
    } else {
      console.log("new room secret invalid")
      socket.emit("room creation error");
    }
  });

  /**
   * Only emitted by clients. If the room exists, they will join it,
   * otherwise, they are added to a queue.
   */
  socket.on("join room", (thingId) => {
    console.log("join room", thingId);
    if (roomCollection[thingId]) {
      socket.join(thingId);
      currentConnection.room = thingId;
      socket.emit("joined room");
    } else {
      if (!queuedUsers[thingId]) queuedUsers[thingId] = [];
      queuedUsers[thingId].push({ socket });
    }
  });

  /**
   * Hit by clients and the streaming service. If the socket belongs to the
   * streaming service, the room will be deleted and all clients will be
   * notified. If the socket belongs to a client, they will leave automatically.
   */
  socket.on("disconnect", async () => {
    console.log("disconnect");
    const room = currentConnection.room;
    if (
      room &&
      roomCollection[room] &&
      roomCollection[room].creatorId === socket.id
    ) {
      socket.to(room).emit("room deleted");
      const sockets = await io.in(room).fetchSockets();
      if (sockets) sockets.forEach((s) => s.leave(room));
      delete roomCollection[currentConnection.room];
      currentConnection.room = undefined;
    }
  });

  /**
   * Emitted by the streaming service, and broadcasted to all of the clients
   * in the room.
   */
  socket.on("data", (data) => {
    console.log("data", data);
    if (currentConnection.room && roomCollection[currentConnection.room]) {
      socket.to(currentConnection.room).emit("data", data);
    }
  });
};

module.exports = handleSocketSession;
