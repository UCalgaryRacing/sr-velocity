import React from "react";
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div id='dashboard'>
      <ProSidebar>
        <Menu iconShape="square">
          <MenuItem>Dashboard</MenuItem>
          <SubMenu title="Dashboard">
            <MenuItem onClick={() => {
              console.log("here")
            }}>Streaming</MenuItem>
            <MenuItem>Historical</MenuItem>
            <MenuItem>Manage</MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>
      <div id='content'>DASHBOARD</div>
    </div>
  );
};

export default Dashboard;
