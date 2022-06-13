// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { Sensor, Session } from "state";
import {
  IconButton,
  RangeSlider,
  ToolTip,
  SingleSlider,
} from "components/interface";
import {
  lightningChart,
  AxisScrollStrategies,
  SolidLine,
  SolidFill,
  ColorHEX,
  FontSettings,
  emptyLine,
  AxisTickStrategies,
  NumericTickStrategy,
  LineSeries,
} from "@arction/lcjs";
import savitzkyGolay from "ml-savitzky-golay";
import { useWindowSize } from "hooks";
import "./_styling/lineChart.css";

const colors: string[] = ["#C22D2D", "#0071B2", "#009E73", "#E69D00"];
const theme = {
  whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
  lightGrayFill: new SolidFill({ color: ColorHEX("#777777") }),
  darkFill: new SolidFill({ color: ColorHEX("#171717") }),
  redFill: new SolidFill({ color: ColorHEX("#C22D2D") }),
};

interface StaticLineChartProps {
  sensors: Sensor[];
  session: Session;
}

export const StaticLineChart: React.FC<StaticLineChartProps> = (
  props: StaticLineChartProps
) => {
  return <div></div>;
};
