// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sensor, Session } from "state";
import { InputField } from "components/interface";
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
  PointSeries,
  PointShape,
  IndividualPointFill,
  ColorRGBA,
} from "@arction/lcjs";
import colormap from "colormap";
import { useForm, useWindowSize } from "hooks";
import "./_styling/scatterChart.css";

const colors: string[] = ["#C22D2D", "#0071B2", "#009E73"];
const defaultColor = ColorRGBA(194, 45, 45, 255);
const pointSize = 3;
const theme = {
  whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
  lightGrayFill: new SolidFill({ color: ColorHEX("#777777") }),
  darkFill: new SolidFill({ color: ColorHEX("#171717") }),
  redFill: new SolidFill({ color: ColorHEX("#C22D2D") }),
};
const colorMap = colormap({
  colormap: "jet",
  nshades: 500,
  format: "hex",
  alpha: 1,
});

interface StaticScatterChartProps {
  allSensors: Sensor[];
  sensors: Sensor[];
  session: Session;
}

export const StaticScatterChart: React.FC<StaticScatterChartProps> = (
  props: StaticScatterChartProps
) => {
  return <div></div>;
};
