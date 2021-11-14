import React, { useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./sidebar.css";
import Hamburger from "hamburger-react";
import {
  RiLineChartLine,
  RiFileHistoryLine,
  RiAddBoxLine,
} from "react-icons/ri";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setOpen] = useState(true);

  return (
    <div id="sidebar">
      <ProSidebar collapsed={collapsed} breakPoint={"md"}>
        <SidebarHeader>
          <Hamburger
            onToggle={() => setCollapsed(!collapsed)}
            toggled={isOpen}
            toggle={setOpen}
            size={24}
          />
        </SidebarHeader>
        <SidebarContent>
          <Menu popperArrow={true}>
            <SubMenu title="Streaming" icon={<RiLineChartLine size={24} />}>
              <MenuItem>Visualization</MenuItem>
              <MenuItem>Raw Data</MenuItem>
            </SubMenu>
            <SubMenu title="Historical" icon={<RiFileHistoryLine size={24} />}>
              <MenuItem>Data</MenuItem>
              <MenuItem>Plots</MenuItem>
            </SubMenu>
            <SubMenu title="Manage" icon={<RiAddBoxLine size={24} />}>
              <MenuItem>Sensors</MenuItem>
              <MenuItem>Drivers</MenuItem>
              <MenuItem>Vehicles</MenuItem>
              <MenuItem>Subteams</MenuItem>
              <MenuItem>Users</MenuItem>
            </SubMenu>
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;

{
  /* <div id="mobile-btn">
        <RiSkullLine />
      </div> */
}
