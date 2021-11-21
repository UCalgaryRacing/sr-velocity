// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";

interface HistoricalProps {
  section: string;
}

const Historical: React.FC<HistoricalProps> = (props: HistoricalProps) => {
  return <div id="historical">{props.section}</div>;
};

export default Historical;
