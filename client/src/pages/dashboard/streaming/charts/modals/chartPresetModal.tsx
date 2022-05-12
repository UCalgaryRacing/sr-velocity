// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { Chart, ChartPreset, Thing } from "state";

interface ChartPresetModalProps {
  show: boolean;
  toggle: any;
  chartPreset?: ChartPreset;
  charts: Chart[];
  thing: Thing;
}

export const ChartPresetModal: React.FC<ChartPresetModalProps> = (
  props: ChartPresetModalProps
) => {
  return <></>;
};
