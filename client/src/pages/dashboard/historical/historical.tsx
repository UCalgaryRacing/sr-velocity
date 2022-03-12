// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord & Justin Tijunelis
import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";

// Section Component Imports
import Data from "./data";
import Plots from "./plots";

enum HistoricalSection {
  DATA = "Data",
  PLOTS = "Plots",
}

const Historical: React.FC = () => {
  const section = useContext(DashboardContext);

  switch (section) {
  case HistoricalSection.DATA:
    return (
      <div id="historical">
        <Data />
      </div>
    );
  case HistoricalSection.PLOTS:
    return (
      <div id="historical">
        <Plots />
      </div>
    );
  default:
    return <></>;
  }
};

export default Historical;
