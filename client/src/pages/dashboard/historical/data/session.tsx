// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord

import { GetApp } from "@mui/icons-material";
import { IconButton } from "../../../../components/interface/iconButton";

export interface SessionType {
  id: number;
  name: string;
}

type Props = {
  session: SessionType;
  handleDownload: (item: SessionType) => void;
};

export default function Session({ session, handleDownload }: Props) {
  return (
    <div className="session data-list-item">
      {session.name}
      <IconButton onClick={() => handleDownload(session)} img={<GetApp />} />
    </div>
  );
}
