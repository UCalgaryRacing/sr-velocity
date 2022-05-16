// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

const { isNewRoomSecretValid } = require("../middleware/auth");

let roomCollection = {};
let queuedUsers = {};

const handleSocketSession = (io, socket) => {
  let currentConnection = { room: undefined };

  /**
   * Emitted by the streaming service. Blocked by any other emissions.
   * When the room is created, all queued users will be notified.
   */
  socket.on("new room", (credentials) => {
    if (isNewRoomSecretValid(credentials.secret)) {
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
      socket.emit("room creation error");
    }
  });

  /**
   * Only emitted by clients. If the room exists, they will join it,
   * otherwise, they are added to a queue.
   */
  socket.on("join room", (thingId) => {
    if (roomCollection[thingId]) {
      socket.join(thingId);
      currentConnection.room = thingId;
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
  socket.on("disconnect", () => {
    const room = currentConnection.room;
    if (room && roomCollection[room].creatorId === socket.id) {
      socket.to(room).emit("room deleted");
      if (io.sockets.adapter.rooms.get(room)) {
        io.sockets.adapter.rooms.get(room).forEach((s) => s.leave(room));
      }
      delete roomCollection[currentConnection.room];
      currentConnection.room = undefined;
    }
  });

  /**
   * Emitted by the streaming service, and broadcasted to all of the clients
   * in the room.
   */
  socket.on("data", (data) => {
    if (currentConnection.room && roomCollection[currentConnection.room]) {
      socket.to(currentConnection.room).emit("data", data);
    }
  });
};

module.exports = handleSocketSession;
