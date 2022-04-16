// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Sensor = {
  _id?: string; // Optional
  smallId?: number; // Optional
  type: string;
  lastUpdate?: number; // Optional
  category: string;
  name: string;
  frequency: number;
  unit: string;
  canId: number;
  disabled: boolean;
  thingId?: string; // Optional
  upperCalibration: number;
  lowerCalibration: number;
  conversionMultiplier: number;
  upperWarning: number;
  lowerWarning: number;
  upperDanger: number;
  lowerDanger: number;
};
