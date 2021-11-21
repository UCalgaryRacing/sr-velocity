// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";

interface StreamingProps {
  section: string;
}

const Streaming: React.FC<StreamingProps> = (props: StreamingProps) => {
  return <div id="streaming">{props.section}</div>;
};

export default Streaming;
