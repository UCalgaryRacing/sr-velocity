import React from "react";
import "./rawBox.css";

interface RawBoxProps {
  sensor: any;
}

const RawBox: React.FC<RawBoxProps> = (props: RawBoxProps) => {
  console.log(props.sensor.name);
  return (
    <div className="raw-box">
      {props.sensor.name}
      <br />
      <br />
      {props.sensor.value}
    </div>
  );
};

export default RawBox;
