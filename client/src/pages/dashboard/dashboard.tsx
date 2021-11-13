import React, { useState } from "react";
import "./dashboard.css";
import Sidebar from "./sidebar";

// <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState("Streaming - A");
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setOpen] = useState(true);

  return (
    <div id="dashboard">
      <Sidebar />
      <div id="content">{title}</div>
    </div>
  );
};

export default Dashboard;
