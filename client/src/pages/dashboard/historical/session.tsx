import GetAppIcon from "@material-ui/icons/GetApp";

export interface SessionType {
  id: number;
  name: string;
}

type Props = {
  session: SessionType;
  handleDownload: (item: SessionType) => void;
}

export default function Session({ session, handleDownload }: Props) {
  return (
    <div className="session data-list-item">
      {session.name}
      <button className="btn download" onClick={() => handleDownload(session)}><GetAppIcon /></button>
    </div>
  );
}