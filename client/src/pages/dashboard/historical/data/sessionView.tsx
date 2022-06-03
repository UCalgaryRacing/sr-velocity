// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord, Justin Tijunelis

import React, { useCallback, useContext, useState } from "react";
import DashNav from "components/navigation/dashNav";
import {
  ToolTip,
  IconButton,
  TextButton,
  Alert,
  InputField,
} from "components/interface";
import { SessionModal } from "./modals/sessionModal";
import { SessionCard } from "./cards/sessionCard";
import { DashboardContext } from "../../dashboard";
import { Add } from "@mui/icons-material";
import { Session, Collection, Thing, Operator } from "state";
import { useWindowSize } from "hooks";
import "./_styling/sessionView.css";

interface SessionViewProps {
  refresh: any;
  viewChange: any;
  thingChange: any;
  thing: Thing;
  sessions: Session[];
  collections: Collection[];
  operators: Operator[];
  onUpdate: (session: Session) => void;
  onDelete: (sessionId: string) => void;
}

export const SessionView: React.FC<SessionViewProps> = (
  props: SessionViewProps
) => {
  const size = useWindowSize();
  const context = useContext(DashboardContext);
  const [query, setQuery] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>(props.sessions);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const generateSessionCards = useCallback(() => {
    let cards: any[] = [];
    for (const session of sessions) {
      cards.push(
        <SessionCard
          key={session._id}
          thing={props.thing}
          session={session}
          collections={props.collections}
          operators={props.operators}
          onUpdate={props.onUpdate}
          onDelete={props.onDelete}
        />
      );
    }
    return cards;
  }, [sessions, props.collections]);

  const onSearch = (query: string) => {
    let matchingSessions = [];
    for (let session of [...props.sessions])
      if (session.name.toLowerCase().includes(query.toLowerCase()))
        // TODO : Search operators and collections too
        matchingSessions.push(session);
    setSessions(matchingSessions);
  };

  return (
    <>
      <DashNav margin={context.margin}>
        <div className="left">
          {props.sessions.length > 0 && props.refresh}
          {size.width >= 916 ? (
            <ToolTip value="New Session">
              <IconButton img={<Add />} onClick={() => setShowModal(true)} />
            </ToolTip>
          ) : (
            <TextButton
              title="New Session"
              onClick={() => setShowModal(true)}
            />
          )}
          {props.viewChange}
        </div>
        <div className="right">
          {props.thingChange}
          <InputField
            name="search"
            type="name"
            placeholder="Search"
            id="manage-nav-search"
            value={query}
            onChange={(e: any) => {
              setQuery(e.target.value.trim());
              onSearch(e.target.value.trim());
            }}
            required
          />
        </div>
      </DashNav>
      {props.sessions.length === 0 ||
        (sessions.length === 0 && (
          <div id="centered">
            <div id="centered-content">
              <b>
                {sessions.length === 0
                  ? "No matching Sessions."
                  : "No Sessions yet."}
              </b>
              {props.sessions.length === 0 && (
                <TextButton
                  title="Create a Session"
                  onClick={() => setShowModal(true)}
                />
              )}
            </div>
          </div>
        ))}
      <div id="session-cards">{generateSessionCards()}</div>
      {showModal && (
        <SessionModal
          show={showModal}
          toggle={(session: Session) => {
            if (session) props.onUpdate(session);
            setShowModal(false);
          }}
          thing={props.thing}
          collections={props.collections}
          operators={props.operators}
        />
      )}
      <Alert
        title="Something went wrong..."
        description="Please try again..."
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </>
  );
};
