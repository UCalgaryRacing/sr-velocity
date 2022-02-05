import React, { useState } from "react";

import SessionList, { Session } from "./sessionList";
import CollectionList, { Collection } from "./collectionList";
import { useFetch } from "../../../hooks/useFetch";

enum ListType {
  Session = "SESSION",
  Collection = "COLLECTION",
}

const Data: React.FC = () => {
  const [listType, setListType] = useState(ListType.Session);
  // Temporary URLs, using json-server for dummy data
  const { data: sessions, error: sessionError } = useFetch<Session[]>(
    "http://localhost:3001/sessions"
  );
  const { data: collections, error: collectionError } = useFetch<Collection[]>(
    "http://localhost:3001/collections"
  );

  return (
    <div id="data">
      <div className="config-bar">
        <button onClick={() => setListType(ListType.Session)}>Sessions</button>
        <button onClick={() => setListType(ListType.Collection)}>Collections</button>
      </div>
      {sessionError || collectionError ? (
        <p>Error fetching data</p>
      ) : !sessions || !collections ? (
        <p>Loading...</p>
      ) : listType === ListType.Session ? (
        <SessionList sessions={sessions} />
      ) : (
        <CollectionList collections={collections} />
      )}
    </div>
  );
};

export default Data;
