// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import TooltipSlider from "rc-slider";
import { isMobile } from "react-device-detect";
import "rc-slider/assets/index.css";
import "./_styling/slider.css";

interface SliderProps {
  onChange: (value: number[]) => void;
  title: string;
  min: number;
  max: number;
  step: number;
  lowerValue: number;
  upperValue: number;
  unit?: string;
}

export const RangeSlider: React.FC<SliderProps> = (props: SliderProps) => {
  return (
    <div className="range-slider">
      <div className="slider-title">{props.title}</div>
      <TooltipSlider
        range
        min={props.min}
        max={props.max}
        defaultValue={[props.lowerValue, props.upperValue]}
        // @ts-ignore
        tipFormatter={(value: number) => `${value}${props.unit}`}
        onChange={(v: number | number[]) => props.onChange(v as number[])}
        handleStyle={{
          height: isMobile ? 25 : 18,
          width: isMobile ? 25 : 18,
          backgroundColor: "#ba1833",
          color: "#ba1833",
          border: 0,
          marginTop: isMobile ? "-10px" : "-6px",
        }}
        trackStyle={{
          backgroundColor: "#ba1833",
          height: 5,
          marginTop: "0px",
        }}
      />
    </div>
  );
};
