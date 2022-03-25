// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import "./_styling/alert.css";

interface AlertProps {
  title: string;
  description: string;
  color: string;
  onDismiss: () => void;
  show: boolean;
}

export const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  if (props.show) {
    return (
      <div className="alert-background" onClick={props.onDismiss}>
        <div className="alert-card" style={{ backgroundColor: props.color }}>
          <div className="alert-title">
            <b>{props.title}</b>
          </div>
          <div className="alert-description">{props.description}</div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
