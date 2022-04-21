// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Sensor } from "state";
import { request } from ".";

export const getSensors = (thingId: string) => {
  return new Promise<Sensor[]>((resolve, reject) => {
    request("GET", "/database/sensors/thing/" + thingId)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const postSensor = (sensor: Sensor) => {
  return new Promise<void>((resolve, reject) => {
    request("POST", "/database/sensors", sensor)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putSensor = (sensor: Sensor) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/sensors", sensor)
      .then((res: any) => resolve(res.data))
      .then((err: any) => reject(err));
  });
};

export const deleteSensor = (sensorId: string) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/sensors/" + sensorId)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};
