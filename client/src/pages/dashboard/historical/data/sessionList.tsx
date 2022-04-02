// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord
import Session, { SessionType } from "./session";

type Props = {
  sessions: SessionType[];
  handleDownload: (item: SessionType) => void;
};

export default function SessionList({ sessions, handleDownload }: Props) {
  return (
    <div id="session-list" className="data-list">
      {sessions.length === 0 ? (
        <p>No Sessions Found</p>
      ) : (
        sessions.map((session) => <Session key={session.id} session={session} handleDownload={handleDownload} />)
      )}
    </div>
  );
}
