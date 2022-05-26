// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

class Stream {
  socket: any;
  historicalData: any = [];
  streaming: boolean;

  // Subscribers
  dataSubscribers: {
    [functionId: string]: {
      smallSensorId: number;
      func: React.RefObject<(datum: number, timestamp: number) => void>;
    };
  };
  sensorsDataSubscribers: {
    [functionId: string]: {
      smallSensorIds: number[];
      func: React.RefObject<(data: any, timestamp: number) => void>;
    };
  };
  dataUpdateSubscribers: {
    [key: string]: React.RefObject<() => void>;
  };
  connectionSubscribers: { [key: string]: React.RefObject<() => void> };
  stopSubscribers: { [key: string]: React.RefObject<() => void> };
  disconnectionSubscribers: { [key: string]: React.RefObject<() => void> };

  constructor() {
    this.socket = undefined;
    this.historicalData = [];
    this.streaming = false;
    this.dataSubscribers = {};
    this.sensorsDataSubscribers = {};
    this.dataUpdateSubscribers = {};
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
      this.streaming = true;
      this.historicalData = [];
      for (const [, func] of Object.entries(this.connectionSubscribers))
        func.current && func.current();
    });

    // When the thing stops streaming
    this.socket.on("room deleted", () => {
      this.streaming = false;
      for (const [, func] of Object.entries(this.stopSubscribers))
        func.current && func.current();
      // Queue up to rejoin the room for another stream
      this.socket.emit("join room", thingId);
    });

    // When there is a disconnection, let the disconnection subscribers know
    this.socket.on("disconnect", () => {
      for (const [, func] of Object.entries(this.disconnectionSubscribers))
        func.current && func.current();
      for (const [, func] of Object.entries(this.stopSubscribers))
        func.current && func.current();
      this.close();
    });

    // On a piece of data, notify the data subscribers
    this.socket.on("data", (data: { [key: string]: number }) => {
      for (const [, pair] of Object.entries(this.dataSubscribers)) {
        if (data[pair.smallSensorId]) {
          pair.func.current &&
            pair.func.current(data[pair.smallSensorId], data["ts"]);
        }
      }
      for (const [, pair] of Object.entries(this.sensorsDataSubscribers)) {
        let message: any = {};
        for (const smallSensorId of pair.smallSensorIds) {
          if (data[smallSensorId]) {
            message[smallSensorId] = data[smallSensorId];
          }
        }
        pair.func.current && pair.func.current(message, data["ts"]);
      }
      this.historicalData.push(data);
    });
  };

  // Unsubscribes all messages
  close = () => {
    if (this.socket) this.socket.disconnect();
    this.historicalData = [];
    this.socket = undefined;
    this.streaming = false;
    this.dataSubscribers = {};
    this.sensorsDataSubscribers = {};
    this.dataUpdateSubscribers = {};
    this.connectionSubscribers = {};
    this.stopSubscribers = {};
    this.disconnectionSubscribers = {};
  };

  isStreaming = () => {
    return this.streaming;
  };

  pushMissingData = (data: any[]) => {
    // TODO: Don't allow any overlapping data!
    let dirtyData = data.concat(this.historicalData);
    let cleanData: any = [dirtyData[0]];
    for (const datum of dirtyData) {
      if (datum["ts"] > cleanData[cleanData.length - 1]["ts"]) {
        cleanData.push(datum);
      }
    }
    this.historicalData = cleanData;
    for (const [, func] of Object.entries(this.dataUpdateSubscribers))
      func.current && func.current();
  };

  getHistoricalData = () => {
    return this.historicalData;
  };

  getHistoricalSensorData = (sensorSmallId: number) => {
    let data: any = [];
    for (const datum of this.historicalData)
      if (datum[sensorSmallId])
        data.push({ x: datum["ts"], y: datum[sensorSmallId] });
    return data;
  };

  getFirstTimeStamp = () => {
    if (this.historicalData.length > 0) return this.historicalData[0]["ts"];
    else return 0;
  };

  worthGettingHistoricalData = () => {
    if (this.historicalData.length > 0) {
      // Only worth it if we are missing more than 30 seconds of data
      let firstTimeStamp = this.historicalData[0]["ts"];
      let secondsOfDataOnServer = firstTimeStamp / 1000;
      return secondsOfDataOnServer >= 30;
    } else return false;
  };

  subscribeToConnection = (func: React.RefObject<() => void>) => {
    let functionId: string = uuidv4();
    this.connectionSubscribers[functionId] = func;
    return functionId;
  };

  unsubscribeFromConnection = (functionId: string) => {
    if (this.connectionSubscribers[functionId])
      delete this.connectionSubscribers[functionId];
  };

  subscribeToSensor = (
    func: React.RefObject<(datum: number, timestamp: number) => void>,
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

  subscribeToSensors = (
    func: React.RefObject<(data: any, timestamp: number) => void>,
    smallSensorIds: number[]
  ) => {
    let functionId: string = uuidv4();
    this.sensorsDataSubscribers[functionId] = { smallSensorIds, func };
    return functionId;
  };

  unsubscribeFromSensors = (functionId: string) => {
    if (this.sensorsDataSubscribers[functionId])
      delete this.sensorsDataSubscribers[functionId];
  };

  subscribeToDataUpdate = (func: React.RefObject<() => void>) => {
    let functionId: string = uuidv4();
    this.dataUpdateSubscribers[functionId] = func;
    return functionId;
  };

  unsubscribeFromDataUpdate = (functionId: string) => {
    if (this.dataUpdateSubscribers[functionId])
      delete this.dataSubscribers[functionId];
  };

  subscribeToStop = (func: React.RefObject<() => void>) => {
    let functionId: string = uuidv4();
    this.stopSubscribers[functionId] = func;
    return functionId;
  };

  unsubscribeFromStop = (functionId: string) => {
    if (this.sensorsDataSubscribers[functionId])
      delete this.sensorsDataSubscribers[functionId];
  };

  subscribeToDisconnection = (func: React.RefObject<() => void>) => {
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
