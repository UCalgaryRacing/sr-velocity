// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import Slider from "rc-slider";
import { useWindowSize } from "hooks";
import "rc-slider/assets/index.css";
import "./_styling/rangeSlider.css";

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
  const size = useWindowSize();

  return (
    <div className="range-slider">
      <div className="slider-title">{props.title}</div>
      <Slider
        range
        min={props.min}
        max={props.max}
        defaultValue={[props.lowerValue, props.upperValue]}
        marks={{ 0: 0, 60: 15, 120: 30 }}
        // tipFormatter={(value: number) => `${value}${props.unit}`}
        onChange={(v: number | number[]) => props.onChange(v as number[])}
        handleStyle={{
          height: size.width <= 768.9 ? 15 : 10,
          width: size.width <= 768.9 ? 15 : 10,
          backgroundColor: "#ba1833",
          color: "#ba1833",
          border: 0,
          opacity: 1,
          marginTop: size.width <= 768.9 ? "-5px" : "-2.5px",
        }}
        trackStyle={{
          backgroundColor: "#ba1833",
          height: 5,
          marginTop: "0px",
        }}
        allowCross={false}
      />
    </div>
  );
};
