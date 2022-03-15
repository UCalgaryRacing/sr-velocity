// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Operator } from "state";

export const getDrivers = (thingId: string) => {
  return new Promise<Operator[]>((resolve, reject) => {});
};

export const postSensor = (sensor: Operator) => {
  return new Promise<Operator>((resolve, reject) => {});
};

export const putSensor = (sensor: Operator) => {
  return new Promise<Operator>((resolve, reject) => {});
};

export const deleteSensor = (sensor: Operator) => {
  return new Promise<void>((resolve, reject) => {});
};
