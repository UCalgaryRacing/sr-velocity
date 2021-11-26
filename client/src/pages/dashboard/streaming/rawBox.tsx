import React from "react";

interface RawBoxProps {
  sensor: any;
}

const RawBox: React.FC<RawBoxProps> = (props: RawBoxProps) => {
  console.log(props.sensor.name);
  return (
    <div className="raw-box">
      {props.sensor.name}
      {props.sensor.value}
    </div>
  );
};

export default RawBox;
