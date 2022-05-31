// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Chart } from ".";

export type ChartPreset = {
  _id: string;
  thingId: string;
  name: string;
  charts: Chart[];
};
