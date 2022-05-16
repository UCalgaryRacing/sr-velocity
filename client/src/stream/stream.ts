// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { io } from "socket.io-client";

class Stream {
  socket: any; // TODO: Find type
  dataSubscribers: {
    smallSensorId: number;
    func: (datum: number, timestamp: number) => void; // Make timestamp optional
  }[];
  sensorsDataSubscribers: {
    smallSensorIds: number[];
    func: (data: any, timestamp: number) => void; // Make timestamp optional
  }[];
  connectionSubscribers: (() => void)[];
  stopSubscribers: (() => void)[]; // TODO: Add functions for sub/unsub
  disconnectionSubscribers: (() => void)[];

  constructor() {
    this.socket = undefined;
    this.dataSubscribers = [];
    this.sensorsDataSubscribers = [];
    this.connectionSubscribers = [];
    this.stopSubscribers = [];
    this.disconnectionSubscribers = [];
  }

  connect = (thingId: string) => {
    const { GATEWAYSERVERIP } = require("./dataServerEnv");
    this.socket = io(GATEWAYSERVERIP, {
      reconnection: false,
      withCredentials: true,
    });

    // Join the thingId room on connection
    this.socket.on("connect", () => {
      this.socket.emit("join room", thingId);
    });

    // When the room is joined, let the connection subscribers know
    this.socket.on("joined room", () => {
      for (const func of this.connectionSubscribers) func();
    });

    // When there is a disconnection, let the disconnection subscribers know
    this.socket.on("disconnect", () => {
      for (const func of this.disconnectionSubscribers) func();
    });

    // On a piece of data, notify the data subscribers
    this.socket.on("data", (data: any) => {
      for (const pair of this.dataSubscribers) {
        if (data[pair.smallSensorId]) {
          pair.func(data[pair.smallSensorId], data["ts"]);
        }
      }
      for (const pair of this.sensorsDataSubscribers) {
        let message: any = {};
        for (const smallSensorId of pair.smallSensorIds) {
          if (data[smallSensorId]) {
            message[smallSensorId] = data[smallSensorId];
          }
        }
        pair.func(message, data["ts"]);
      }
    });
  };

  // Unsubscribes all messages
  close = () => {
    if (this.socket) this.socket.close();
    this.socket = undefined;
    this.dataSubscribers = [];
    this.sensorsDataSubscribers = [];
    this.connectionSubscribers = [];
    this.stopSubscribers = [];
    this.disconnectionSubscribers = [];
  };

  subscribeToConnection = (func: () => void) => {
    this.#handleDuplicateFunctions(this.dataSubscribers, func);
    this.connectionSubscribers.push(func);
  };

  unsubscribeFromConnection = (func: () => void) => {
    this.#removeFunction(this.connectionSubscribers, func);
  };

  subscribeToSensor = (
    func: (datum: number, timestamp: number) => void,
    smallSensorId: number
  ) => {
    this.#handleDuplicateFunctions(this.dataSubscribers, func);
    this.dataSubscribers.push({ smallSensorId, func });
  };

  unsubscribeFromSensor = (
    func: (datum: number, timestamp: number) => void
  ) => {
    this.#removeFunction(this.dataSubscribers, func);
  };

  subscribeToSensors = (
    func: (data: any, timestamp: number) => void,
    smallSensorIds: number[]
  ) => {
    this.#handleDuplicateFunctions(this.sensorsDataSubscribers, func);
    this.sensorsDataSubscribers.push({ smallSensorIds, func });
  };

  unsubscribeFromSensors = (func: (data: any, timestamp: number) => void) => {
    this.#removeFunction(this.sensorsDataSubscribers, func);
  };

  subscribeToDisconnection = (func: () => void) => {
    this.disconnectionSubscribers.push(func);
  };

  unsubscribeFromDisconnection = (func: () => void) => {
    this.#removeFunction(this.disconnectionSubscribers, func);
  };

  #handleDuplicateFunctions = (functionList: any[], newFunction: any) => {
    let duplicates = functionList.filter(
      (ds) => ds.func.toString() == newFunction.toString()
    );
    if (duplicates.length > 0) {
      throw new Error(
        "A function with the exact same code as an already subscribed function attempted to subscribe."
      );
    }
  };

  #removeFunction = (functionList: any[], toRemove: any) => {
    for (const i in functionList) {
      if (functionList[i].func.toString() === toRemove.toString()) {
        this.dataSubscribers.splice(Number(i), 1);
      }
    }
  };
}

export { Stream };
