import React, { useState, useEffect } from "react";
import Sidebar from "components/navigation/side-navigation/sidebar";
import { useSwipeable } from "react-swipeable";
import {
  useAppSelector,
  useAppDispatch,
  RootState,
  dashboardPageSelected,
} from "state";
import { bindActionCreators } from "redux";
import useWindowSize from "hooks/useWindowSize";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  // State
  const [sideBarToggled, setSideBarToggled] = useState(false);

  // Hooks
  const gestures = useSwipeable({
    onSwipedRight: (_) => {
      if (size.width <= 768.9) setSideBarToggled(true);
    },
    onSwipedLeft: (_) => {
      if (size.width <= 768.9) setSideBarToggled(false);
    },
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
        {() => {
          if (!dashboard) return <></>;
          switch (dashboard.page) {
            // Streaming
            case "Real-time Charts":
              return <></>;
            case "Raw Data":
              return <></>;
            // Historical
            case "Data":
              return <></>;
            case "Plots":
              return <></>;
            // Manage
            case "Sensors":
              return <></>;
            case "Drivers":
              return <></>;
            case "Vehicles":
              return <></>;
            case "Users":
              return <></>;
            default:
              return <></>;
          }
        }}
      </div>
    </div>
  );
};

export default Dashboard;
