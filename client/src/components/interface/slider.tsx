// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import Slider from "rc-slider";
import { useWindowSize } from "hooks";
import "rc-slider/assets/index.css";
import "./_styling/slider.css";

interface SliderProps {
  onChange: (value: number) => void;
  title: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
  marks: any;
}

export const SingleSlider: React.FC<SliderProps> = (props: SliderProps) => {
  const size = useWindowSize();

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
      />
    </div>
  );
};
