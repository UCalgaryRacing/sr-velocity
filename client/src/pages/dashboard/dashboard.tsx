import React from "react";
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div id='dashboard'>
      <ProSidebar>
        <Menu iconShape="square">

          <SubMenu title="Streaming">
            <MenuItem onClick={() => {
              console.log("here")
            }}>A</MenuItem>
            <MenuItem>B</MenuItem>
            <MenuItem>C</MenuItem>
          </SubMenu>

          <SubMenu title="Historical">
            <MenuItem>A</MenuItem>
            <MenuItem>B</MenuItem>
            <MenuItem>C</MenuItem>
          </SubMenu>

          <SubMenu title="Manage">
          <MenuItem>A</MenuItem>
          <MenuItem>B</MenuItem>
          <MenuItem>C</MenuItem>
          </SubMenu>

          <SubMenu title="Sensor Fusion">
          <MenuItem>A</MenuItem>
          <MenuItem>B</MenuItem>
          <MenuItem>C</MenuItem>
          </SubMenu>

        </Menu>
      </ProSidebar>
      <div id='content'>STREAMING</div>
    </div>
  );
};

export default Dashboard;
