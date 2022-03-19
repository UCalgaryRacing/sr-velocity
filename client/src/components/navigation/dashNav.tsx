// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import "./_styling/dashNav.css";

interface DashNavProps {
  margin: number;
  children?: React.ReactNode;
}

const DashNav: React.FC<DashNavProps> = (props: DashNavProps) => {
  return (
    <div id="dash-nav" style={{ left: props.margin }}>
      {props.children}
    </div>
  );
};

export default DashNav;
