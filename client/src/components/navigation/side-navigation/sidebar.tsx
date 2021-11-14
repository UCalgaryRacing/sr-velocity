import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import Hamburger from "hamburger-react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import {
  RiLineChartLine,
  RiFileHistoryLine,
  RiAddBoxLine,
} from "react-icons/ri";
import "react-pro-sidebar/dist/css/styles.css";
import "./sidebar.css";

const structure = [
  {
    name: "Streaming",
    image: <RiLineChartLine size={24} />,
    children: ["Real-time Charts", "Raw Data"],
  },
  {
    name: "Historical",
    image: <RiFileHistoryLine size={24} />,
    children: ["Data", "Plots"],
  },
  {
    name: "Manage",
    image: <RiAddBoxLine size={24} />,
    children: ["Sensors", "Drivers", "Vehicles", "Subteams", "Users"],
  },
];

interface SidebarProps {
  toggled: boolean;
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setOpen] = useState(true);

  return (
    <div id="sidebar">
      <ProSidebar
        toggled={isMobile && props.toggled}
        collapsed={collapsed}
        breakPoint={"md"}
      >
        {!isMobile && (
          <SidebarHeader>
            <Hamburger
              onToggle={() => setCollapsed(!collapsed)}
              toggled={isOpen}
              toggle={setOpen}
              size={24}
            />
          </SidebarHeader>
        )}
        <SidebarContent>
          <Menu popperArrow={true}>
            {structure.map((submenu) => {
              return (
                <SubMenu title={submenu.name} icon={submenu.image}>
                  {submenu.children.map((name) => {
                    return <MenuItem>{name}</MenuItem>;
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;
