// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import RawData from "./rawData";

interface StreamingProps {
  section: string;
}

const Streaming: React.FC<StreamingProps> = (props: StreamingProps) => {
  return (
    <div id="streaming">
      <RawData />
    </div>
  );
};

export default Streaming;
