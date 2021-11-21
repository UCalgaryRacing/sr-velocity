// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";

interface ManageProps {
  section: string;
}

const Manage: React.FC<ManageProps> = (props: ManageProps) => {
  return <div id="manage">{props.section}</div>;
};

export default Manage;
