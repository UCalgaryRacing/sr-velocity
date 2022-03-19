// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Operator, Sensor } from "./";

export type Thing = {
  _id: string;
  name: string;
  serialNumber: string;
  sensors: Sensor[];
  operators: Operator[];
};
