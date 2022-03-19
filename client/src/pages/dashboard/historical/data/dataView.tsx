// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord

import React, { useState, useContext } from "react";
import { IconButton, ToolTip, SegmentedControl } from "components/interface";
import DashNav from "components/navigation/dashNav";
import RunList from "./runList";
import { RunType } from "./run";
import SessionList from "./sessionList";
import { SessionType } from "./session";
import { DashboardContext } from "../../dashboard";
import { SaveOutlined, Add, Air, Category } from "@mui/icons-material";
import { useFetch } from "hooks/useFetch";
import "./_styling/dataView.css";

enum ListType {
  Session = "SESSION",
  Run = "RUN",
}

const DataView: React.FC = () => {
  const context = useContext(DashboardContext);
  const [listType, setListType] = useState(ListType.Session);
  // Temporary URLs, using json-server for dummy data
  const { data: sessions, error: sessionError } = useFetch<SessionType[]>(
    "http://localhost:3001/sessions"
  );
  const { data: runs, error: runError } = useFetch<RunType[]>(
    "http://localhost:3001/runs"
  );

  const handleDownload = (item: RunType | SessionType) => {
    // Download item as csv
    console.log(item);
  };

  const onContextChange = (selection: any) => {
    console.log(selection);
  };

  return (
    <div id="data-view">
      <DashNav margin={context.margin}>
        <div className="left">
          <SegmentedControl
            name="view"
            options={[
              { label: "Runs", value: "runs", default: true },
              { label: "Sessions", value: "sessions" },
            ]}
            onChange={onContextChange}
          />
          <ToolTip value="New Chart">
            <IconButton img={<Add />} />
          </ToolTip>
        </div>
        <div className="right"></div>
      </DashNav>
      {sessionError || runError ? (
        <p>Error fetching data</p>
      ) : !sessions || !runs ? (
        <p>Loading...</p>
      ) : listType === ListType.Session ? (
        <SessionList sessions={sessions} handleDownload={handleDownload} />
      ) : (
        <RunList runs={runs} handleDownload={handleDownload} />
      )}
    </div>
  );
};

export default DataView;
