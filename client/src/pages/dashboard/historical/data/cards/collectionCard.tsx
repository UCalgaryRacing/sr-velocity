// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord

import { Comment, GetApp } from "@mui/icons-material";
import { IconButton } from "components/interface";
import { useState } from "react";

export interface SessionType {
  id: number;
  name: string;
}

type Props = {
  session: SessionType;
  handleDownload: (item: SessionType) => void;
};

export default function CollectionCard({ session, handleDownload }: Props) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="session data-list-item">
      {session.name}
      <IconButton onClick={() => handleDownload(session)} img={<GetApp />} />
      <IconButton
        onClick={() => setShowComments((prev) => !prev)}
        img={<Comment />}
      />
      {/* {showComments && <Comments item={session} itemType="session" />} */}
    </div>
  );
}
