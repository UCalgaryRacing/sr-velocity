// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord, Justin Tijunelis

import React, { useCallback, useContext, useState } from "react";
import DashNav from "components/navigation/dashNav";
import { ToolTip, IconButton, TextButton, Alert } from "components/interface";
import { SessionModal } from "./modals/sessionModal";
import { SessionCard } from "./cards/sessionCard";
import { DashboardContext } from "../../dashboard";
import { Add } from "@mui/icons-material";
import { Session, Collection } from "state";
import { useWindowSize } from "hooks";

interface SessionViewProps {
  viewChange: any;
  thingChange: any;
  sessions: Session[];
  collections: Collection[];
  onUpdate: (session: Session) => void;
  onDelete: (sessionId: string) => void;
}

export const SessionView: React.FC<SessionViewProps> = (
  props: SessionViewProps
) => {
  const size = useWindowSize();
  const context = useContext(DashboardContext);
  const [showModal, setShowModal] = useState<boolean>(false);

  const generateSessionCards = useCallback(() => {
    let cards: any[] = [];
    for (const session of props.sessions) {
      cards.push(
        <SessionCard
          key={session._id}
          session={session}
          collections={props.collections}
          onUpdate={props.onUpdate}
          onDelete={props.onDelete}
        />
      );
    }
    return cards;
  }, [props.sessions, props.collections]);

  return (
    <>
      <DashNav margin={context.margin}>
        <div className="left">
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
        <div className="right">{props.thingChange}</div>
      </DashNav>
      {generateSessionCards()}
      {showModal && (
        <SessionModal
          show={showModal}
          toggle={() => setShowModal(false)}
          collections={props.collections}
        />
      )}
    </>
  );
};
