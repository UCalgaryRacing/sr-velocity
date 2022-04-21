// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import { IconButton } from "components/interface";
import { CloseOutlined, Edit } from "@mui/icons-material";
import { Thing } from "state";
import "./_styling/thingCard.css";

interface ThingCardProps {
  thing: Thing;
}

// TODO: Show associated operators
// Only show delete and edit if admin
export const ThingCard: React.FC<ThingCardProps> = (props: ThingCardProps) => {
  return (
    <div className="thing-card">
      <div className="thing-title">
        <b>{props.thing.name}</b>
      </div>
      <div className="thing-id">Serial Number:&nbsp;{props.thing._id}</div>
      <IconButton id="thing-delete" img={<CloseOutlined />} />
      <IconButton id="thing-edit" img={<Edit />} />
    </div>
  );
};
