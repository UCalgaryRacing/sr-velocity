// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect } from "react";
import "./_styling/alert.css";

interface AlertProps {
  title: string;
  description: string;
  color: string;
  onDismiss: () => void;
  show: boolean;
  slideOut?: boolean;
  duration?: number;
  // TODO: Add a margin
}

export const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  const [showAlert, setShowAlert] = useState<boolean>(props.show);
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    if (props.color === "red") setColor("#ba1833");
    else if (props.color === "green") setColor("#33ba18");
  }, [props.color]);

  useEffect(() => {
    setShowAlert(props.show);
    if (props.show) timeoutAlert();
  }, [props.show]);

  const timeoutAlert = () => {
    setTimeout(
      () => {
        setShowAlert(false);
        props.onDismiss();
      },
      props.duration ? props.duration * 1000 : 3000
    );
  };

  if (showAlert && !props.slideOut) {
    return (
      <div className="alert-background" onClick={props.onDismiss}>
        <div className="alert-card" style={{ backgroundColor: color }}>
          <div className="alert-title">
            <b>{props.title}</b>
          </div>
          <div className="alert-description">{props.description}</div>
        </div>
      </div>
    );
  } else if (props.slideOut) {
    return (
      <div
        className={"sliding-alert-card " + (showAlert ? "shown" : "hidden")}
        onClick={() => {
          setShowAlert(false);
          props.onDismiss();
        }}
        style={{ backgroundColor: color }}
      >
        <div className="alert-title">
          <b>{props.title}</b>
        </div>
        <div className="alert-description">{props.description}</div>
      </div>
    );
  } else {
    return <></>;
  }
};
