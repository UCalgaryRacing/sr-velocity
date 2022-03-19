// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";
import ChartView from "./charts/chartView";
import RawDataView from "./raw_data/rawDataView";

enum StreamingSection {
  CHARTS = "Real-Time Charts",
  RAW_DATA = "Raw Data",
}

const Streaming: React.FC = () => {
  const context = useContext(DashboardContext);

  switch (context.page) {
    case StreamingSection.CHARTS:
      return <ChartView />;
    case StreamingSection.RAW_DATA:
      return <RawDataView />;
    default:
      return <></>;
  }
};

export default Streaming;
