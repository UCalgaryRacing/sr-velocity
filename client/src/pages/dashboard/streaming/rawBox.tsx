import React, { useState } from "react";
import "./rawBox.css";

var rn = require("random-number");

interface RawBoxProps {
  sensor: any;
}

const a = "red";

const RawBox: React.FC<RawBoxProps> = (props: RawBoxProps) => {
  const [value, setValue] = useState(0);

  var optionsLow = {
    min: 0,
    max: 5,
    integer: true,
  };

  var optionsHigh = {
    min: 10,
    max: 15,
    integer: true,
  };

  var upperBound = rn(optionsHigh);
  var lowerBound = rn(optionsLow);

  var optionsValue = {
    min: lowerBound,
    max: upperBound,
    integer: true,
  };

  // setValue(rn(optionsValue));
  const rvalue = rn(optionsValue);

  return (
    <div className="raw-box" style={{ backgroundColor: a }}>
      {props.sensor.name}
      <br />
      <br />
      {rvalue}
      {/* {props.sensor.value} */}
    </div>
  );
};

export default RawBox;