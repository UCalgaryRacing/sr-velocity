// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./_styling/tooltip.css";

interface ToolTipProps {
  value: any;
  children?: any;
}

export const ToolTip: React.FC<ToolTipProps> = (props: ToolTipProps) => {
  return (
    <OverlayTrigger
      overlay={<Tooltip id="tooltip">{props.value}</Tooltip>}
      placement="auto"
    >
      {props.children}
    </OverlayTrigger>
  );
};
