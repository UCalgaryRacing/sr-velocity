// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Sensor } from "state";

export const getSensors = (thingId: string) => {
  return new Promise<Sensor[]>((resolve, reject) => {});
};

export const postSensor = (sensor: Sensor) => {
  return new Promise<Sensor>((resolve, reject) => {
    resolve(sensor);
  });
};

export const putSensor = (sensor: Sensor) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteSensor = (sensorId: string) => {
  return new Promise<void>((resolve, reject) => {});
};
