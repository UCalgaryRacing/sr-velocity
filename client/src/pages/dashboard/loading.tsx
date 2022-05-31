// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import "./_styling/dashboardLoading.css";

interface DashboardLoadingProps {
  style?: any;
  children: any;
}

export const DashboardLoading: React.FC<DashboardLoadingProps> = (props) => {
  return (
    <div id="dashboard-loading" style={props.style}>
      <div id="dashboard-loading-content">{props.children}</div>
    </div>
  );
};
