export interface SessionType {
  id: number;
  name: string;
}

type Props = {
  session: SessionType
}

export default function Session({session}: Props) {
  return (
    <div className="session">
      {session.name}
    </div>
  );
}