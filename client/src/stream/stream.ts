// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

class Stream {
  socket: any;
  historicalData: any = [];

  // Subscribers
  dataSubscribers: {
    [key: string]: {
      smallSensorId: number;
      func: (datum: number, timestamp: number) => void; // Make timestamp optional
    };
  };
  sensorsDataSubscribers: {
    [key: string]: {
      smallSensorIds: number[];
      func: any; // Make timestamp optional
    };
  };
  connectionSubscribers: { [key: string]: () => void };
  stopSubscribers: { [key: string]: () => void };
  disconnectionSubscribers: { [key: string]: () => void };

  constructor() {
    this.socket = undefined;
    this.historicalData = [];
    this.dataSubscribers = {};
    this.sensorsDataSubscribers = {};
    this.connectionSubscribers = {};
    this.stopSubscribers = {};
    this.disconnectionSubscribers = {};
  }

  connect = (thingId: string) => {
    const { GATEWAYSERVERIP } = require("./dataServerEnv");
    this.socket = io(GATEWAYSERVERIP, {
      withCredentials: true,
      reconnection: false,
    });

    // Join the thingId room on connection
    this.socket.on("connect", () => {
      this.socket.emit("join room", thingId);
    });

    // When the room is joined, let the connection subscribers know
    // Streaming is about to begin, so we clear the previous historical data
    this.socket.on("joined room", () => {
      this.historicalData = [];
      for (const [_, func] of Object.entries(this.connectionSubscribers))
        func();
    });

    // When the thing stops streaming
    this.socket.on("room deleted", () => {
      for (const [_, func] of Object.entries(this.stopSubscribers)) func();
      // Queue up to rejoin the room for another stream
      this.socket.emit("join room", thingId);
    });

    // When there is a disconnection, let the disconnection subscribers know
    this.socket.on("disconnect", () => {
      for (const [_, func] of Object.entries(this.disconnectionSubscribers))
        func();
      this.close();
    });

    // On a piece of data, notify the data subscribers
    this.socket.on("data", (data: any) => {
      for (const [_, pair] of Object.entries(this.dataSubscribers)) {
        if (data[pair.smallSensorId]) {
          pair.func(data[pair.smallSensorId], data["ts"]);
        }
      }
      for (const [_, pair] of Object.entries(this.sensorsDataSubscribers)) {
        let message: any = {};
        for (const smallSensorId of pair.smallSensorIds) {
          if (data[smallSensorId]) {
            message[smallSensorId] = data[smallSensorId];
          }
        }
        pair.func.current(message, data["ts"]);
      }
      this.historicalData.push(data);
    });
  };

  // Unsubscribes all messages
  close = () => {
    if (this.socket) this.socket.close();
    this.historicalData = [];
    this.socket = undefined;
    this.dataSubscribers = {};
    this.sensorsDataSubscribers = {};
    this.connectionSubscribers = {};
    this.stopSubscribers = {};
    this.disconnectionSubscribers = {};
  };

  getHistoricalData = () => {
    return this.historicalData;
  };

  getHistoricalSensorData = (sensorSmallId: number) => {
    let data: any = [];
    for (const datum of this.historicalData)
      if (datum[sensorSmallId])
        data.push({ ts: datum["ts"], value: datum[sensorSmallId] });
    return data;
  };

  subscribeToConnection = (func: () => void) => {
    let functionId: string = uuidv4();
    this.connectionSubscribers[functionId] = func;
    return functionId;
  };

  unsubscribeFromConnection = (functionId: string) => {
    if (this.connectionSubscribers[functionId])
      delete this.connectionSubscribers[functionId];
  };

  subscribeToSensor = (
    func: (datum: number, timestamp: number) => void,
    smallSensorId: number
  ) => {
    let functionId: string = uuidv4();
    this.dataSubscribers[functionId] = { smallSensorId, func };
    return functionId;
  };

  unsubscribeFromSensor = (functionId: string) => {
    if (this.dataSubscribers[functionId])
      delete this.dataSubscribers[functionId];
  };

  // func type is React ref
  subscribeToSensors = (func: any, smallSensorIds: number[]) => {
    let functionId: string = uuidv4();
    this.sensorsDataSubscribers[functionId] = { smallSensorIds, func };
    return functionId;
  };

  unsubscribeFromSensors = (functionId: string) => {
    if (this.sensorsDataSubscribers[functionId])
      delete this.sensorsDataSubscribers[functionId];
  };

  subscribeToStop = (func: () => void) => {
    let functionId: string = uuidv4();
    this.stopSubscribers[functionId] = func;
    return functionId;
  };

  unsubscribeFromStop = (functionId: string) => {
    if (this.sensorsDataSubscribers[functionId])
      delete this.sensorsDataSubscribers[functionId];
  };

  subscribeToDisconnection = (func: () => void) => {
    let functionId: string = uuidv4();
    this.disconnectionSubscribers[functionId] = func;
    return functionId;
  };

  unsubscribeFromDisconnection = (functionId: string) => {
    if (this.disconnectionSubscribers[functionId])
      delete this.disconnectionSubscribers[functionId];
  };
}

export { Stream };
