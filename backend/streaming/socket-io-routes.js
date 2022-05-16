// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

let roomCollection = {};
let queuedUsers = {};

// TODO: Implement security
const initializeSocketRoutes = (io, socket) => {
  let currentConnection = {
    room: undefined,
  };
  /**
   * Emitted by the streaming service. Blocked by any other emissions.
   * When the room is created, all queued users will be notified.
   */
  socket.on("new room", (thing_id) => {
    roomCollection[thing_id] = { creatorId: socket.id };
    currentConnection.room = thing_id;
    socket.join(thing_id);
    if (queuedUsers[thing_id]) {
      for (const queuedUser of queuedUsers[thing_id]) {
        queuedUser.socket.join(thing_id);
        queuedUser.socket.emit("joined room");
      }
      delete queuedUsers[thing_id];
    }
  });

  /*
   * Only emitted by clients. If the room exists, they will join it,
   * otherwise, they are added to a queue.
   */
  socket.on("join room", (thing_id) => {
    if (roomCollection[thing_id]) {
      socket.join(thing_id);
    } else {
      if (!queuedUsers[thing_id]) queuedUsers[thing_id] = [];
      queuedUsers[thing_id].push({ socket });
    }
  });

  /**
   * Hit by clients and the streaming service. If the socket belongs to the
   * streaming service, the room will be deleted and all clients will be
   * notified. If the socket belongs to a client, they will leave automatically.
   */
  socket.on("disconnect", () => {
    if (currentConnection.room) {
      if (roomCollection[currentConnection.room].creatorId === socket.id) {
        if (io.sockets.adapter.rooms.get(currentConnection.room)) {
          io.sockets.adapter.rooms.get(currentConnection.room).forEach((s) => {
            if (s.id !== socket.id) {
              s.emit("room deleted");
              s.leave(room);
            }
          });
        }
        delete roomCollection[currentConnection.room];
        currentConnection.room = undefined;
      }
    }
  });

  /**
   * Emitted by the streaming service, and broadcasted to all of the clients
   * in the room.
   */
  socket.on("data", (data) => {
    if (currentConnection.room && roomCollection[currentConnection.room]) {
      console.log(data);
      io.sockets.adapter.rooms.get(currentConnection.room).forEach((s) => {
        if (s.id !== roomCollection[currentConnection.room].creator_id)
          s.emit("data", data);
      });
    }
  });
};

module.exports = initializeSocketRoutes;
