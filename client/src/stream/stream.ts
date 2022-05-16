// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { io } from "socket.io-client";

class Stream {
  static instance = new Stream();
  socket: any; // TODO: Find type
  dataSubscribers: {
    sensorId: number;
    func: (datum: number, timestamp: number) => void;
  }[];
  connectionSubscibers: (() => void)[];
  disconnectionSubscribers: (() => void)[];

  constructor() {
    this.socket = undefined;
    this.dataSubscribers = [];
    this.connectionSubscibers = [];
    this.disconnectionSubscribers = [];
  }

  static getInstance = () => {
    if (Stream.instance === null) Stream.instance = new Stream();
    return this.instance;
  };

  init = (thingId: string) => {
    const { DATASTREAMINGIP } = require("./dataServerEnv");
    this.socket = io(DATASTREAMINGIP); //CHANGE WHEN DEPLOYING!

    // Join the thingId room on connection
    this.socket.on("connect", () => {
      this.socket.emit("join room", thingId);
    });

    // When the room is joined, let the connection subscribers know
    this.socket.on("joined room", () => {
      for (const func of this.connectionSubscibers) func();
    });

    // When there is a disconnection, let the disconnection subscribers know
    this.socket.on("disconnect", () => {
      // TODO: Find the actual event name
      for (const func of this.disconnectionSubscribers) func();
    });

    // On a piece of data, notify the data subscribers
    this.socket.on("data", (data: any) => this.#onData(data));
  };

  close = () => {
    if (this.socket) this.socket.close();
    this.socket = undefined;
    this.dataSubscribers = [];
    this.connectionSubscibers = [];
    this.disconnectionSubscribers = [];
  };

  subscribeToConnection = (func: () => void) => {
    this.connectionSubscibers.push(func);
  };

  unsubscribeFromConnection = (func: () => void) => {
    // TODO: Remove from connection subscribers
  };

  subscribeToSensor = (
    func: (datum: number, timestamp: number) => void,
    sensorId: number
  ) => {
    this.dataSubscribers.push({ sensorId, func });
  };

  unsubscribeFromSensor = (func: (datum: number) => void) => {
    // TODO: Remove from subscription list
  };

  subscribeToDisconnection = (func: () => void) => {
    this.disconnectionSubscribers.push(func);
  };

  unsubscribeFromDisconnection = (func: () => void) => {
    // TODO
  };

  #onData = (data: any) => {
    for (const pair of this.dataSubscribers) {
    }
    // Notify all subscribers of their respective data
  };
}

export { Stream };
