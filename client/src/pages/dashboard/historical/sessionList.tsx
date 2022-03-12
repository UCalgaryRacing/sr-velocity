// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord
import Session, { SessionType } from "./session";

type Props = {
  sessions: SessionType[];
};

export default function SessionList({ sessions }: Props) {
  return (
    <div id="session-list">
      {sessions.length === 0 ? (
        <p>No Sessions Found</p>
      ) : (
        sessions.map((session) => <Session key={session.id} session={session} />)
      )}
    </div>
  );
}
