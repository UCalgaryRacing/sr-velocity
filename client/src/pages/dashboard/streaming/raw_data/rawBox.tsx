import React, { useState, useEffect } from "react";
import "./rawBox.css";

var rn = require("random-number");

interface RawBoxProps {
  sensor: any;
}

const RawBox: React.FC<RawBoxProps> = (props: RawBoxProps) => {
  var optionsLow = {
    min: 0,
    max: 25,
    integer: true,
  };

  var optionsHigh = {
    min: 70,
    max: 100,
    integer: true,
  };

  var upperBound = rn(optionsHigh);
  var lowerBound = rn(optionsLow);

  var optionsValue = {
    min: lowerBound,
    max: upperBound,
    integer: true,
  };

  const [rvalue, setValue] = useState(0);
  const pvalue = (rvalue - lowerBound) / (upperBound - lowerBound);

  useEffect(() => {
    var intervalId = window.setInterval(function () {
      setValue(rn(optionsValue));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className="raw-box"
      style={{ backgroundColor: pvalue < 0.66 ? "green" : "red" }}
    >
      {props.sensor.name}
      <br />
      <br />
      {rvalue}
    </div>
  );
};

export default RawBox;
