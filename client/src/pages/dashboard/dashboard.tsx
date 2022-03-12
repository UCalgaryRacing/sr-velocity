// Copyright Schulich Racing FSAE
// Written by Ryan Painchaud, Justin Tijunelis

import React, { useState } from "react";
import Sidebar from "components/navigation/sidebar";
import Streaming from "./streaming/streaming";
import Historical from "./historical/historical";
import Manage from "./manage/manage";
import { useWindowSize } from "hooks/index";
import { useSwipeable } from "react-swipeable";
import { useAppSelector, RootState } from "state";
import "./_styling/dashboard.css";

export const DashboardContext = React.createContext("");

const Dashboard: React.FC = () => {
  // State
  const [sideBarToggled, setSideBarToggled] = useState(false);
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);

  // Hooks
  const gestures = useSwipeable({
    onSwipedRight: (_) => size.width <= 768.9 && setSideBarToggled(true),
    onSwipedLeft: (_) => size.width <= 768.9 && setSideBarToggled(false),
    trackMouse: true,
  });
  const size = useWindowSize();

  // Redux
  const dashboard = useAppSelector((state: RootState) => state.dashboard);

  return (
    <div id="dashboard" {...gestures}>
      <Sidebar toggled={sideBarToggled} onCollapse={setSideBarCollapsed} />
      <div
        id="content"
        style={{
          marginLeft:
            size.width >= 768.9 ? (sideBarCollapsed ? "80px" : "270px") : "0px",
        }}
      >
        <DashboardContext.Provider value={dashboard!.page}>
          <Streaming />
          <Historical />
          <Manage />
        </DashboardContext.Provider>
      </div>
    </div>
  );
};

export default Dashboard;
