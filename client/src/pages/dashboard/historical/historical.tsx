// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord & Justin Tijunelis

import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";
import DataView from "./data/dataView";
import PlotView from "./plots/plotView";

enum HistoricalSection {
  DATA = "Data",
  PLOTS = "Plots",
}

const Historical: React.FC = () => {
  const context = useContext(DashboardContext);

  switch (context.page) {
    case HistoricalSection.DATA:
      return <DataView />;
    case HistoricalSection.PLOTS:
      return <PlotView />;
    default:
      return <></>;
  }
};

export default Historical;
