// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Sensor = {
  _id: string;
  smallId: number;
  type: string;
  lastUpdate: number;
  category?: string;
  name: string;
  frequency: number;
  unit?: string;
  canId: number;
  disabled: boolean;
  thingId: string;
  upperCalibration?: number;
  lowerCalibration?: number;
  conversionMultiplier?: number;
  upperWarning?: number;
  lowerWarning?: number;
  upperDanger?: number;
  lowerDanger?: number;
};

export const sensorTypes = {
  c: "Character",
  b: "Signed Byte",
  B: "Unsigned Byte",
  "?": "Boolean",
  h: "Short",
  H: "Unsigned Short",
  i: "Integer",
  I: "Unsigned Integer",
  l: "Long",
  L: "Unsigned Long",
  q: "Long Long",
  Q: "Unsigned Long Long",
  f: "Floating Point",
  d: "Double",
};

export const hexToNumber = (hex: string) => {
  return parseInt(hex, 16);
};

export const numberToHex = (number: number) => {
  return number.toString(16);
};
