import React, { useState } from "react";
import Sidebar from "components/navigation/side-navigation/sidebar";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState("Streaming - A");

  return (
    <div id="dashboard">
      <Sidebar />
      <div id="content">Hello</div>
    </div>
  );
};

export default Dashboard;
