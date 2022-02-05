import React from "react";

import SessionList, { Session } from "./sessionList";
import { useFetch } from "../../../hooks/useFetch";

const Data: React.FC = () => {
  // Temporary URL, using json-server for dummy data
  const { data: sessions, error } = useFetch<Session[]>("http://localhost:3001/sessions");

  if (error) return <p>Error fetching data</p>;
  if (!sessions) return <p>Loading...</p>;
  return (
    <div id="data">
      <SessionList sessions={sessions} />
    </div>
  );
};

export default Data;
