import React, { useState, useEffect } from "react";
import Sidebar from "components/navigation/side-navigation/sidebar";
import { useSwipeable } from "react-swipeable";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  // State
  const [sideBarToggled, setSideBarToggled] = useState(false);

  // Hooks
  const gestures = useSwipeable({
    onSwipedRight: (_) => setSideBarToggled(true),
    onSwipedLeft: (_) => setSideBarToggled(false),
  });

  useEffect(() => {});

  return (
    <div id="dashboard" {...gestures}>
      <Sidebar toggled={sideBarToggled} />
      <div id="content">Hello</div>
    </div>
  );
};

export default Dashboard;
