// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Driver } from "state";

export const getDrivers = (thingId: string) => {
  return new Promise<Driver[]>((resolve, reject) => {});
};

export const postSensor = (sensor: Driver) => {
  return new Promise<Driver>((resolve, reject) => {});
};

export const putSensor = (sensor: Driver) => {
  return new Promise<Driver>((resolve, reject) => {});
};

export const deleteSensor = (sensor: Driver) => {
  return new Promise<void>((resolve, reject) => {});
};
