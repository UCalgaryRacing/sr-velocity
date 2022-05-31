// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Sensor = {
  _id: string;
  smallId: number;
  type: string;
  lastUpdate: number;
  name: string;
  frequency: number;
  unit?: string;
  canId: number;
  thingId: string;
  upperCalibration?: number;
  lowerCalibration?: number;
  conversionMultiplier?: number;
  upperWarning?: number;
  lowerWarning?: number;
  upperDanger?: number;
  lowerDanger?: number;
  lowerBound: number;
  upperBound: number;
  significance: number;
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
  let hex = number.toString(16);
  if (hex.length < 8) {
    let zeroCount = 8 - hex.length;
    console.log(zeroCount);
    for (let i = 0; i < zeroCount; i++) {
      hex = "0" + hex;
    }
  }
  return hex;
};
