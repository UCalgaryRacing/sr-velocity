// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export enum ChartType {
  HEATMAP = "Heat Map",
  LINE = "Line",
  RADIAL = "Radial",
  SCATTER = "Scatter",
}

export type Chart = {
  _id: string;
  name: string;
  type: string;
  sensorIds: string[];
};
