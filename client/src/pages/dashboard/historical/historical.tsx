// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";

enum HistoricalSection {
  DATA = "Data",
  PLOTS = "Plots",
}

const Historical: React.FC = () => {
  const section = useContext(DashboardContext);

  switch (section) {
    case HistoricalSection.DATA:
      return <div id="historical">{section}</div>;
    case HistoricalSection.PLOTS:
      return <div id="historical">{section}</div>;
    default:
      return <></>;
  }
};

export default Historical;
