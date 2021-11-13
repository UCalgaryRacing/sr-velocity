import React, { useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./sidebar.css";
import Hamburger from "hamburger-react";
//import "./in-time.png";

// <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

const Sidebar: React.FC = () => {
  const [title, setTitle] = useState("Streaming - A");
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setOpen] = useState(true);

  return (
    <div id="sidebar">
      <ProSidebar collapsed={collapsed} collapsedWidth={75} breakPoint={"md"}>
        <SidebarHeader>
          <Hamburger
            onToggle={() => {
              setCollapsed(!collapsed);
            }}
            toggled={isOpen}
            toggle={setOpen}
          />
        </SidebarHeader>

        <Menu>
          <SubMenu title="Streaming">
            <MenuItem
              onClick={() => {
                setTitle("Streaming - A");
              }}
            >
              A
            </MenuItem>
            <MenuItem
              onClick={() => {
                setTitle("Streaming - B");
              }}
            >
              B
            </MenuItem>
            <MenuItem
              onClick={() => {
                setTitle("Streaming - C");
              }}
            >
              C
            </MenuItem>
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
      <div id="content">{title}</div>
    </div>
  );
};

export default Sidebar;
