// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
// @ts-ignore
import { SegmentedControl as SC } from "segmented-control";
import "./_styling/segmentedControl.css";

interface SegmentedControlProps {
  name?: string;
  options: any[];
  onChange: (newSelection: any) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = (
  props: SegmentedControlProps
) => {
  return (
    <SC
      name={props.name}
      options={props.options}
      setValue={props.onChange}
      style={{ color: "#ba1833" }}
    />
  );
};
