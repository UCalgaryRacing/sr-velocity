import Comments from "./comments";
import GetAppIcon from "@material-ui/icons/GetApp";
import CommentIcon from "@material-ui/icons/Comment";
import { useState } from "react";

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
};

export default function Run({ run, handleDownload }: Props) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="run data-list-item">
      <p className="run-date">
        {run.startDate.toLocaleString()} - {run.endDate.toLocaleString()}
      </p>
      <button className="btn download" onClick={() => handleDownload(run)}>
        <GetAppIcon />
      </button>
      <button className="btn comment" onClick={() => setShowComments((prev) => !prev)}>
        <CommentIcon />
      </button>
      {showComments && <Comments item={run} itemType="run" />}
    </div>
  );
}
