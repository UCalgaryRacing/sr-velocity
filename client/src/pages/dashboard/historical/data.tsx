// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord
import React, { useState } from "react";
import RunList, { Run } from "./runList";
import SessionList, { Session } from "./sessionList";
import { useFetch } from "../../../hooks/useFetch";

enum ListType {
  Session = "SESSION",
  Run = "RUN",
}

const Data: React.FC = () => {
  const [listType, setListType] = useState(ListType.Session);
  // Temporary URLs, using json-server for dummy data
  const { data: sessions, error: sessionError } = useFetch<Session[]>(
    "http://localhost:3001/sessions"
  );
  const { data: runs, error: runError } = useFetch<Run[]>(
    "http://localhost:3001/runs"
  );

  return (
    <div id="data">
      <div className="config-bar">
        <button onClick={() => setListType(ListType.Session)}>Sessions</button>
        <button onClick={() => setListType(ListType.Run)}>Runs</button>
      </div>
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
