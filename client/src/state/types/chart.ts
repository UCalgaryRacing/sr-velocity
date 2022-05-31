// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export enum ChartType {
  LINE = "Line",
  RADIAL = "Radial",
  SCATTER = "Scatter",
}

export type Chart = {
  _id: string;
  name: string;
  type: string;
  chartPresetId?: string;
  sensorIds: string[];
};
