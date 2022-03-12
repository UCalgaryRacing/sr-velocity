import GetAppIcon from "@material-ui/icons/GetApp";

export interface RunType {
  id: number;
  sessionId: number;
  thingId: number;
  startDate: Date;
  endDate: Date;
}

type Props = {
  run: RunType;
  handleDownload: (item: RunType) => void;
}

export default function Run({ run, handleDownload }: Props) {
  return (
    <div className="run data-list-item">
      <p className="run-date">{run.startDate.toLocaleString()} - {run.endDate.toLocaleString()}</p>
      <button className="btn download" onClick={() => handleDownload(run)}><GetAppIcon /></button>
    </div>
  );
}