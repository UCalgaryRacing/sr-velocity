// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord, Justin Tijunelis

import React, { useEffect, useState } from "react";
import {
  SegmentedControl,
  DropDown,
  TextButton,
  IconButton,
  ToolTip,
  Alert,
} from "components/interface";
import { Thing, Session, Collection, Operator } from "state";
import { DashboardLoading } from "../../loading";
import { CollectionView } from "./collectionView";
import { SessionView } from "./sessionView";
import { getSessions, getCollections, getOperators } from "crud";
import { CachedOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useWindowSize } from "hooks";
import "./_styling/dataView.css";

enum ListType {
  SESSION = "SESSION",
  COLLECTION = "COLLECTION",
}

interface DataViewProps {
  things: Thing[];
  thing: Thing;
  onThingChange: (thing: Thing) => void;
}

const DataView: React.FC<DataViewProps> = (props: DataViewProps) => {
  const size = useWindowSize();
  const [listType, setListType] = useState<ListType>(ListType.SESSION);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [fetching, setFetching] = useState<{
    [k: string]: string | boolean;
  }>({ fetching: false, error: false });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");

  useEffect(() => fetchCollectionsOperatorsSessions(), []);
  useEffect(() => {
    fetchCollectionsOperatorsSessions();
  }, [props.thing]);

  const fetchCollectionsOperatorsSessions = () => {
    setFetching({
      fetching: true,
      error: false,
    });
    getOperators()
      .then((operators: Operator[]) => {
        let thingOperators = operators.filter((o) =>
          o.thingIds.includes(props.thing._id)
        );
        thingOperators.sort((a: Operator, b: Operator) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setOperators(thingOperators);
        getSessions(props.thing._id)
          .then((sessions: Session[]) => {
            sessions.sort(
              (a: Session, b: Session) => b.startTime - a.startTime
            );
            setSessions(sessions);
            getCollections(props.thing._id)
              .then((collections: Collection[]) => {
                setCollections(collections);
                setFetching({ ...fetching, fetching: false });
              })
              .catch((_: any) =>
                setFetching({ ...fetching, fetching: false, error: true })
              );
          })
          .catch((_: any) =>
            setFetching({ ...fetching, fetching: false, error: true })
          );
      })
      .catch((_: any) =>
        setFetching({ ...fetching, fetching: false, error: true })
      );
  };

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSessionUpdate = (session: Session) => {
    if (session && session._id) {
      let updatedSessions = [...sessions];
      let updated = false;
      for (let i in sessions) {
        if (updatedSessions[i]._id === session._id) {
          updatedSessions[i] = session;
          updated = true;
        }
      }
      if (!updated) updatedSessions.push(session);
      updatedSessions.sort(
        (a: Session, b: Session) => b.startTime - a.startTime
      );
      setSessions(updatedSessions);
      alert(updated ? "Session updated!" : "Session created!");
    }
  };

  const onSessionDelete = (sessionId: string) => {
    if (!sessionId) return;
    let updatedSessions = [];
    for (let session of sessions)
      if (session._id !== sessionId) updatedSessions.push(session);
    setSessions(updatedSessions);
    alert("Session deleted!");
  };

  const onCollectionUpdate = (collection: Collection) => {
    if (collection && collection._id) {
      let updatedCollections = [...collections];
      let updated = false;
      for (let i in collections) {
        if (updatedCollections[i]._id === collection._id) {
          updatedCollections[i] = collection;
          updated = true;
        }
      }
      if (!updated) updatedCollections.push(collection);
      updatedCollections.sort((a: Collection, b: Collection) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setCollections(updatedCollections);
      alert(updated ? "Collection updated!" : "Collection created!");
    }
  };

  const onCollectionDelete = (collectionId: string) => {
    if (!collectionId) return;
    let updatedCollections = [];
    for (let collection of collections)
      if (collection._id !== collectionId) updatedCollections.push(collection);
    setCollections(updatedCollections);
    alert("Collection deleted!");
  };

  let viewChange = (
    <SegmentedControl
      name="view"
      options={[
        { label: "Sessions", value: ListType.SESSION, default: true },
        { label: "Collections", value: ListType.COLLECTION },
      ]}
      onChange={setListType}
    />
  );

  let thingChange = (
    <DropDown
      placeholder="Select Thing..."
      options={props.things.map((thing) => {
        return {
          value: thing,
          label: thing.name,
        };
      })}
      defaultValue={
        props.thing ? { value: props.thing, label: props.thing.name } : null
      }
      onChange={(value: any) => props.onThingChange(value.value)}
      isSearchable
    />
  );

  let refresh =
    size.width >= 916 ? (
      <ToolTip value="Refresh">
        <IconButton
          img={<CachedOutlined />}
          onClick={() => fetchCollectionsOperatorsSessions()}
        />
      </ToolTip>
    ) : (
      <TextButton
        title="Refresh"
        onClick={() => fetchCollectionsOperatorsSessions()}
      />
    );

  if (fetching["fetching"] || fetching["error"]) {
    return (
      <DashboardLoading>
        {(() => {
          if (fetching["fetching"]) {
            return (
              <>
                <CircularProgress style={{ color: "black" }} />
                <br />
                <br />
                <b>Fetching Collections, Operators, and Sessions...</b>
              </>
            );
          } else {
            return (
              <>
                <b>Failed to fetch Collections, Operators, and Sessions.</b>
                <TextButton
                  title="Try Again"
                  onClick={() => fetchCollectionsOperatorsSessions()}
                />
              </>
            );
          }
        })()}
      </DashboardLoading>
    );
  } else {
    return (
      <>
        {listType === ListType.SESSION ? (
          <SessionView
            refresh={refresh}
            viewChange={viewChange}
            thingChange={thingChange}
            thing={props.thing}
            sessions={sessions}
            collections={collections}
            operators={operators}
            onUpdate={onSessionUpdate}
            onDelete={onSessionDelete}
          />
        ) : (
          <CollectionView
            viewChange={viewChange}
            thingChange={thingChange}
            sessions={sessions}
            collections={collections}
            onUpdate={onCollectionUpdate}
            onDelete={onCollectionDelete}
          />
        )}
        <Alert
          title={"Success"}
          description={alertDescription}
          color="green"
          onDismiss={() => setShowAlert(false)}
          show={showAlert}
          slideOut
        />
      </>
    );
  }
};

export default DataView;
