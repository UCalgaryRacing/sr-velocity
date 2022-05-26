// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import Slider, { SliderProps } from "rc-slider";
import { HandleTooltip } from "./handleTooltip";
import { useWindowSize } from "hooks";
import "rc-slider/assets/index.css";
import "./_styling/rangeSlider.css";

interface RangeSliderProps {
  onChange: (value: number[]) => void;
  title: string;
  min: number;
  max: number;
  step: number;
  lowerValue: number;
  upperValue: number;
  unit?: string;
  marks?: any;
  tipFormatter: any;
}

export const RangeSlider: React.FC<RangeSliderProps> = (
  props: RangeSliderProps
) => {
  const size = useWindowSize();
  const tipHandleRender: SliderProps["handleRender"] = (node, handleProps) => {
    if (handleProps.dragging) {
      return (
        <HandleTooltip
          value={handleProps.value}
          visible={handleProps.dragging}
          tipFormatter={props.tipFormatter}
        >
          {node}
        </HandleTooltip>
      );
    } else {
      return <>{node}</>;
    }
  };

  return (
    <div className="range-slider">
      <div className="slider-title">{props.title}</div>
      <Slider
        range
        min={props.min}
        max={props.max}
        defaultValue={[props.lowerValue, props.upperValue]}
        marks={props.marks}
        onChange={(v: number | number[]) => props.onChange(v as number[])}
        handleStyle={{
          height: size.width <= 916 ? 15 : 10,
          width: size.width <= 916 ? 15 : 10,
          backgroundColor: "#ba1833",
          color: "#ba1833",
          border: 0,
          opacity: 1,
          marginTop: size.width <= 916 ? "-5px" : "-2.5px",
        }}
        trackStyle={{
          backgroundColor: "#ba1833",
          height: 5,
          marginTop: "0px",
        }}
        allowCross={false}
        handleRender={tipHandleRender}
      />
    </div>
  );
};
