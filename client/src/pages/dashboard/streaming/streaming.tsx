// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";

enum StreamingSection {
  REAL_TIME = "Real-time Charts",
  RAW_DATA = "Raw Data",
}

const Streaming: React.FC = () => {
  const section = useContext(DashboardContext);

  switch (section) {
    case StreamingSection.REAL_TIME:
      return <div id="streaming">{section}</div>;
    case StreamingSection.RAW_DATA:
      return <div id="streaming">{section}</div>;
    default:
      return <></>;
  }
};

export default Streaming;
