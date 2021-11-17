// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Sensors = Sensor[];

export type Sensor = {
  name: string;
  sid: number;
  frequency: number;
  type: string;
  disabled: boolean;
  unit: string;
  // Future: Add calibration
};
