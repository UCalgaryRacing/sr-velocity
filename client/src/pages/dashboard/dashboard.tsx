import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./dashboard.css";
import Hamburger from "hamburger-react"

// <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState("Streaming - A");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div id='dashboard'>
      <ProSidebar collapsed={collapsed} collapsedWidth={90}>
        <SidebarHeader 
          onClick={() => {
          setCollapsed(!collapsed)}}
          >
          Collapse icon</SidebarHeader>
        <Menu iconShape="square">

          <SubMenu defaultOpen={true} title="Streaming" icon>
            <MenuItem onClick={() => {
              setTitle("Streaming - A")
            }}>A</MenuItem>
            <MenuItem onClick={() => {
              setTitle("Streaming - B")
            }}>B</MenuItem>
            <MenuItem onClick={() => {
              setTitle("Streaming - C")
            }}>C</MenuItem>
          </SubMenu>

          <SubMenu title="Historical" icon>
            <MenuItem>A</MenuItem>
            <MenuItem>B</MenuItem>
            <MenuItem>C</MenuItem>
          </SubMenu>

          <SubMenu title="Manage" icon>
          <MenuItem>A</MenuItem>
          <MenuItem>B</MenuItem>
          <MenuItem>C</MenuItem>
          </SubMenu>

          <SubMenu title="Sensor Fusion" icon>
          <MenuItem>A</MenuItem>
          <MenuItem>B</MenuItem>
          <MenuItem>C</MenuItem>
          </SubMenu>

        </Menu>
      </ProSidebar>
      <div id='content'>{title}</div>
    </div>
  );
};

export default Dashboard;
