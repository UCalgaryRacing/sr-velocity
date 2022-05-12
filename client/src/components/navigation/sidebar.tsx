// Copyright Schulich Racing FSAE
// Written by Ryan Painchaud, Justin Tijunelis

import React, { useEffect, useState } from "react";
import Hamburger from "hamburger-react";
import { bindActionCreators } from "redux";
import {
  useAppSelector,
  useAppDispatch,
  RootState,
  dashboardPageSelected,
  UserRole,
  isAuthAtLeast,
} from "state";
import {
  History,
  DataObject,
  StackedLineChart,
  Settings,
} from "@mui/icons-material";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import { useWindowSize } from "hooks/index";
import "react-pro-sidebar/dist/css/styles.css";
import "./_styling/sidebar.css";

interface SidebarProps {
  toggled: boolean;
  onCollapse?: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [structure, setStructure] = useState<any>([
    {
      name: "Streaming",
      image: <StackedLineChart />,
      children: ["Real-Time Charts", "Raw Data"],
      color: "#fff",
    },
    {
      name: "Historical",
      image: <History />,
      children: ["Data", "Plots"],
      color: "#fff",
    },
    {
      name: "Manage",
      image: <DataObject />,
      children: [
        "Organization",
        "Profile",
        "Users",
        "Things",
        "Sensors",
        "Operators",
      ],
      color: "#fff",
    },
  ]);
  const state = useAppSelector((state: RootState) => state);
  const selected = bindActionCreators(dashboardPageSelected, useAppDispatch());
  const size = useWindowSize();

  useEffect(() => {
    let updatedStructure = [...structure];
    for (let section of structure) {
      if (section.name === state.dashboard.section) {
        section.image = React.cloneElement(section.image, {
          htmlColor: "#171717",
        });
        section.color = "#171717";
      } else {
        section.image = React.cloneElement(section.image, {
          htmlColor: "#fff",
        });
        section.color = "#fff";
      }
    }
    setStructure(updatedStructure);
  }, [state.dashboard.section]);

  return (
    <ProSidebar
      collapsed={!((collapsed && !props.toggled) || size.width <= 768.9)}
      toggled={props.toggled}
      breakPoint="md"
      width={220}
    >
      {size.width >= 768.9 && (
        <SidebarHeader>
          <div>
            <Hamburger
              key="hamburger"
              onToggle={() => {
                if (props.onCollapse) props.onCollapse(!collapsed);
                setCollapsed(!collapsed);
              }}
              size={24}
            />
          </div>
        </SidebarHeader>
      )}
      <SidebarContent>
        <Menu popperArrow={true}>
          {structure.map((sub: any) => {
            return (
              <SubMenu
                key={sub.name}
                title={sub.name}
                icon={sub.image}
                style={{ color: sub.color }}
                id={sub.color === "#fff" ? "unselected" : "selected"}
              >
                {sub.children.map((name: string) => {
                  if (
                    !isAuthAtLeast(state.user, UserRole.ADMIN) &&
                    name === "Organization"
                  )
                    return;
                  if (
                    !isAuthAtLeast(state.user, UserRole.LEAD) &&
                    name === "Users"
                  )
                    return;
                  return (
                    <>
                      <MenuItem
                        key={name}
                        onClick={() =>
                          selected({ page: name, section: sub.name })
                        }
                        active={name === state.dashboard.page}
                        style={{
                          color:
                            name === state.dashboard.page ? "#000" : "#fff",
                        }}
                      >
                        {name}
                      </MenuItem>
                    </>
                  );
                })}
              </SubMenu>
            );
          })}
        </Menu>
      </SidebarContent>
      {/* <SidebarFooter>
        <Menu>
          <SubMenu
            key="Settings"
            title="Settings"
            icon={<Settings />}
            onClick={() => {
              // TODO: Show settings modal
            }}
          />
        </Menu>
      </SidebarFooter> */}
    </ProSidebar>
  );
};

export default Sidebar;
