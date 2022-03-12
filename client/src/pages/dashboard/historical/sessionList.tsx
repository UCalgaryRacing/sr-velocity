export interface Session {
  id: number;
  collectionId: number;
  thingId: number;
  startDate: Date;
  endDate: Date;
}

type Props = {
  sessions: Session[];
};

export default function SessionList({ sessions }: Props) {
  return (
    <div id="session-list">
      {sessions.length === 0 ? (
        <p>No Sessions Found</p>
      ) : (
        sessions.map((session) => <div key={session.id}>{session.id}</div>)
      )}
    </div>
  );
}
