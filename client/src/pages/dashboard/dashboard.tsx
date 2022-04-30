// Copyright Schulich Racing FSAE
// Written by Ryan Painchaud, Justin Tijunelis

import React, { useEffect, useState } from "react";
import Sidebar from "components/navigation/sidebar";
import Streaming from "./streaming/streaming";
import Historical from "./historical/historical";
import Manage from "./manage/manage";
import { useWindowSize } from "hooks/";
import { useSwipeable } from "react-swipeable";
import {
  useAppSelector,
  RootState,
  useAppDispatch,
  organizationFetched,
  Organization,
} from "state";
import { getOrganization } from "crud";
import { bindActionCreators } from "redux";
import "./_styling/dashboard.css";

export const DashboardContext = React.createContext({
  page: "",
  margin: 0,
});

const Dashboard: React.FC = () => {
  const dashboard = useAppSelector((state: RootState) => state.dashboard);
  const setOrganization = bindActionCreators(
    organizationFetched,
    useAppDispatch()
  );

  const [sideBarToggled, setSideBarToggled] = useState<boolean>(false);
  const [sideBarCollapsed, setSideBarCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [setupError, setSetupError] = useState<boolean>(false);

  const gestures = useSwipeable({
    onSwipedRight: (_) => size.width <= 768.9 && setSideBarToggled(true),
    onSwipedLeft: (_) => size.width <= 768.9 && setSideBarToggled(false),
    trackMouse: true,
  });
  const size = useWindowSize();

  useEffect(() => {
    setLoading(true);
    getOrganization()
      .then((organization: Organization) => {
        setOrganization(organization);
        setLoading(false);
      })
      .catch((_: any) => setSetupError(true));
    // TODO: Actually show loading stuff
  }, []);

  useEffect(() => {
    if (size.width >= 768.9 && sideBarToggled) setSideBarToggled(false);
  }, [size.width]);

  return (
    <div id="dashboard" {...gestures}>
      <Sidebar toggled={sideBarToggled} onCollapse={setSideBarCollapsed} />
      {loading ? (
        ""
      ) : (
        <div
          id="content"
          style={{
            marginLeft:
              size.width >= 768.9 ? (!sideBarCollapsed ? 76 : 220) : 0,
          }}
        >
          <DashboardContext.Provider
            value={{
              page: dashboard!.page,
              margin: size.width >= 768.9 ? (!sideBarCollapsed ? 76 : 220) : 0,
            }}
          >
            <Streaming />
            <Historical />
            <Manage />
          </DashboardContext.Provider>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
