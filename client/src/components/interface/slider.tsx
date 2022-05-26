// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import Slider, { SliderProps } from "rc-slider";
import { HandleTooltip } from "./handleTooltip";
import { useWindowSize } from "hooks";
import "rc-slider/assets/index.css";
import "./_styling/slider.css";

interface SingleSliderProps {
  onChange: (value: number) => void;
  title: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
  marks?: any;
  tipFormatter: any;
}

export const SingleSlider: React.FC<SingleSliderProps> = (
  props: SingleSliderProps
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
    <div className="slider">
      <div className="slider-title">{props.title}</div>
      <Slider
        min={props.min}
        max={props.max}
        marks={props.marks}
        defaultValue={props.default}
        step={props.step}
        onChange={(v: number | number[]) => props.onChange(v as number)}
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
        handleRender={tipHandleRender}
      />
    </div>
  );
};
