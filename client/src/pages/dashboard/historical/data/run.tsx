// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord

import { Comment } from "@mui/icons-material";
import Comments from "./comments";
import { GetApp } from "@mui/icons-material";
import { IconButton } from "../../../../components/interface/iconButton";
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
      <IconButton onClick={() => handleDownload(run)} img={<GetApp />} />
      <IconButton onClick={() => setShowComments((prev) => !prev)} img={<Comment />} />
      {showComments && <Comments item={run} itemType="run" />}
    </div>
  );
}
