// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord
import React, { useState } from "react";
import DashNav from "../dashnav";
import RunList from "./runList";
import { RunType } from "./run";
import SessionList from "./sessionList";
import { SessionType } from "./session";
import { useFetch } from "../../../hooks/useFetch";

enum ListType {
  Session = "SESSION",
  Run = "RUN",
}

const Data: React.FC = () => {
  const [listType, setListType] = useState(ListType.Session);
  // Temporary URLs, using json-server for dummy data
  const { data: sessions, error: sessionError } = useFetch<SessionType[]>(
    "http://localhost:3001/sessions"
  );
  const { data: runs, error: runError } = useFetch<RunType[]>(
    "http://localhost:3001/runs"
  );

  return (
    <div id="data">
      <DashNav>
        <button onClick={() => setListType(ListType.Session)}>Sessions</button>
        <button onClick={() => setListType(ListType.Run)}>Runs</button>
      </DashNav>
      {sessionError || runError ? (
        <p>Error fetching data</p>
      ) : !sessions || !runs ? (
        <p>Loading...</p>
      ) : listType === ListType.Session ? (
        <SessionList sessions={sessions} />
      ) : (
        <RunList runs={runs} />
      )}
    </div>
  );
};

export default Data;
