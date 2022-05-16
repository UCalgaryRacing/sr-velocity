// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@mui/icons-material";
import { Sensor } from "state";
import { Stream } from "stream/stream";
import "./_styling/rawBox.css";

interface RawBoxProps {
  sensor: Sensor;
  stream: Stream;
  onDelete: (sensorId: string) => void;
}

const RawBox: React.FC<RawBoxProps> = (props: RawBoxProps) => {
  const [value, setValue] = useState<number>(0);
  const [color, setColor] = useState<string>();

  useEffect(() => {
    props.stream.subscribeToSensor(onDatum, props.sensor.smallId);
    return () => {
      props.stream.unsubscribeFromSensor(onDatum);
    };
  }, []);

  useEffect(() => {
    // Handle lower danger
    const lowerDanger = props.sensor.lowerDanger;
    if (lowerDanger && value <= lowerDanger) {
      setColor("#ba1833");
      return;
    }

    // Handle lower warning
    const lowerWarning = props.sensor.lowerWarning;
    if (lowerWarning && value <= lowerWarning) {
      setColor("#baad18");
      return;
    }

    // Handle upper warning
    const upperWarning = props.sensor.upperWarning;
    if (upperWarning && value >= upperWarning) {
      setColor("#baad18");
      return;
    }

    // Handle upper danger
    const upperDanger = props.sensor.upperDanger;
    if (upperDanger && value >= upperDanger) {
      setColor("#ba1833");
      return;
    }

    setColor("#33ba18");
  }, [value]);

  const onDatum = (data: number, _: number) => {
    setValue(data);
  };

  return (
    <div className="raw-box" style={{ background: color }}>
      <div className="raw-box-title">{props.sensor.name}</div>
      <div className="raw-box-value">
        {value + (props.sensor.unit ? " " + props.sensor.unit : "")}
      </div>
      <div
        className="raw-box-close"
        onClick={() => props.onDelete(props.sensor._id)}
      >
        <CloseOutlined />
      </div>
    </div>
  );
};

export default RawBox;
