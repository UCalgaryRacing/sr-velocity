// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { ChartBox, ChartType } from "components/charts/";

const ChartView: React.FC = () => {
  return (
    <div id="chart-view">
      <ChartBox title={"Title"} type={ChartType.LINE} realtime />
    </div>
  );
};

export default ChartView;
