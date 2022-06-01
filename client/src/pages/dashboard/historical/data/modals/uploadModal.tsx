// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { Session } from "state";

interface UploadModalProps {
  session: Session;
  onOpload: (session: Session) => void;
}

export const UploadModal: React.FC<UploadModalProps> = (
  props: UploadModalProps
) => {
  return <></>;
};
