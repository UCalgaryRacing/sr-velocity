// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useRef } from "react";
import { CloseOutlined } from "@mui/icons-material";
import { Sensor } from "state";
import { Stream } from "stream/stream";
import "./_styling/rawBox.css";

const UPDATE_TIMEOUT = 500;

interface RawBoxProps {
  sensor: Sensor;
  stream: Stream;
  onDelete: (sensorId: string) => void;
}

// TODO: Implement moving average
const RawBox: React.FC<RawBoxProps> = (props: RawBoxProps) => {
  const onDatumCallback = useRef<() => void>(null);
  const [value, setValue] = useState<number>(0);
  const [color, setColor] = useState<string>();
  const [updateTimeout, setUpdateTimeout] = useState<number>(0);

  // @ts-ignore
  useEffect(() => (onDatumCallback.current = onDatum), [updateTimeout]);

  useEffect(() => {
    const functionId: string = props.stream.subscribeToSensor(
      onDatumCallback,
      props.sensor.smallId
    );
    return () => {
      props.stream.unsubscribeFromSensor(functionId);
    };
  }, []);

  useEffect(() => {
    // On/Off for boolean
    if (props.sensor.type === "?") {
      setColor("#ba1833");
      return;
    }

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
    console.log("onDatum", data);
    if (!data) return;
    setValue(data);
    let timeBetweenTimestamps = 1000 / props.sensor.frequency;
    let lastUpdate = updateTimeout - timeBetweenTimestamps;
    if (lastUpdate <= 0) {
      setUpdateTimeout(UPDATE_TIMEOUT);
    } else setUpdateTimeout(lastUpdate);
  };

  return (
    <div className="raw-box" style={{ background: color }}>
      <div className="raw-box-title">{props.sensor.name}</div>
      {props.sensor.type !== "?" ? (
        <div className="raw-box-value">
          {value + (props.sensor.unit ? " " + props.sensor.unit : "")}
        </div>
      ) : (
        <div className="raw-box-value">{value === 0 ? "OFF" : "ON"}</div>
      )}
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
