// Copyright Schulich Racing FSAE
// Written by Ryan Painchaud, Justin Tijunelis

import React, { useState } from "react";
import Hamburger from "hamburger-react";
import { bindActionCreators } from "redux";
import {
  useAppSelector,
  useAppDispatch,
  RootState,
  dashboardPageSelected,
} from "state";
import {
  RiLineChartLine,
  RiFileHistoryLine,
  RiAddBoxLine,
} from "react-icons/ri";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./_styling/sidebar.css";

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
    children: ["Sensors", "Drivers", "Vehicles", "Users"],
  },
];

interface SidebarProps {
  toggled: boolean;
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  // State
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setOpen] = useState(true);

  // Redux
  const dashboard = useAppSelector((state: RootState) => state.dashboard);
  const pageSelected = bindActionCreators(
    dashboardPageSelected,
    useAppDispatch()
  );

  return (
    <div id="sidebar">
      <ProSidebar
        collapsed={collapsed && !props.toggled}
        toggled={props.toggled}
        breakPoint={"md"}
      >
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
            {structure.map((submenu) => {
              return (
                <SubMenu
                  key={submenu.name}
                  title={submenu.name}
                  icon={submenu.image}
                  defaultOpen={
                    dashboard
                      ? submenu.children.includes(dashboard.page)
                      : false
                  }
                >
                  {submenu.children.map((name) => {
                    return (
                      <MenuItem
                        key={name}
                        onClick={() => pageSelected(name)}
                        active={dashboard ? name === dashboard.page : false}
                      >
                        {name}
                      </MenuItem>
                    );
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
