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
  // TODO: Add lower and upper bound
  // FUTURE: Add protocol
};

export const sensorTypes = {
  "?": "Boolean",
  c: "Signed Byte",
  B: "Unsigned Byte",
  h: "Short",
  H: "Unsigned Short",
  i: "Integer",
  I: "Unsigned Integer",
  f: "Floating Point",
  q: "Long Long",
  Q: "Unsigned Long Long",
  d: "Double",
};

export const hexToNumber = (hex: string) => {
  return parseInt(hex, 16);
};

export const numberToHex = (number: number) => {
  return number.toString(16);
};
