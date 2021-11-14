// Copyright Schulich Racing FSAE
// Written by Ryan Painchaud, Justin Tijunelis

import React, { useState, useEffect } from "react";
import Sidebar from "components/navigation/sidebar";
import Streaming from "./streaming/streaming";
import Historical from "./historical/historical";
import Manage from "./manage/manage";
import { useWindowSize } from "hooks/index";
import { useSwipeable } from "react-swipeable";
import { bindActionCreators } from "redux";
import {
  useAppSelector,
  useAppDispatch,
  RootState,
  dashboardPageSelected,
} from "state";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  // State
  const [sideBarToggled, setSideBarToggled] = useState(false);

  // Hooks
  const gestures = useSwipeable({
    onSwipedRight: (_) => size.width <= 768.9 && setSideBarToggled(true),
    onSwipedLeft: (_) => size.width <= 768.9 && setSideBarToggled(false),
    trackMouse: true,
  });
  const size = useWindowSize();

  // Redux
  const dashboard = useAppSelector((state: RootState) => state.dashboard);
  const pageSelected = bindActionCreators(
    dashboardPageSelected,
    useAppDispatch()
  );

  useEffect(() => {
    if (!dashboard) pageSelected("Real-time Charts");
  }, []);

  return (
    <div id="dashboard" {...gestures}>
      <Sidebar toggled={sideBarToggled} />
      <div id="content">
        {(() => {
          if (!dashboard) return <></>;
          switch (dashboard.page) {
            case "Real-time Charts":
            case "Raw Data":
              return <Streaming section={dashboard.page} />;
            case "Data":
            case "Plots":
              return <Historical section={dashboard.page} />;
            case "Sensors":
            case "Drivers":
            case "Vehicles":
            case "Users":
              return <Manage section={dashboard.page} />;
            default:
              return <></>;
          }
        })()}
      </div>
    </div>
  );
};

export default Dashboard;
