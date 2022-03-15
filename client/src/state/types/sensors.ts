// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Sensor = {
  _id: string;
  smallId: number;
  type: string;
  lastUpdate: number;
  category: string;
  name: string;
  frequency: number;
  unit: string;
  canId: number;
  disabled: boolean;
  thingId: string;
  upperCalibration: number;
  lowerCalibration: number;
  conversionMultiplier: number;
  upperWarning: number;
  lowerWarning: number;
  upperDanger: number;
  lowerDanger: number;
};
