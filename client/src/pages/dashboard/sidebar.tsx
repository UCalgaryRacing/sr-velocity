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
import {
  RiLineChartLine,
  RiFileHistoryLine,
  RiAddBoxLine,
  RiSensorLine,
} from "react-icons/ri";

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
          <SubMenu title="Streaming" icon={<RiLineChartLine size={32} />}>
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

          <SubMenu title="Historical" icon={<RiFileHistoryLine size={32} />}>
            <MenuItem>A</MenuItem>
            <MenuItem>B</MenuItem>
            <MenuItem>C</MenuItem>
          </SubMenu>

          <SubMenu title="Manage" icon={<RiAddBoxLine size={32} />}>
            <MenuItem>A</MenuItem>
            <MenuItem>B</MenuItem>
            <MenuItem>C</MenuItem>
          </SubMenu>

          <SubMenu title="Sensor Fusion" icon={<RiSensorLine size={32} />}>
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
