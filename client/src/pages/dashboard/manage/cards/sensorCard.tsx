// Copyright Schulich Racing FSAE
// Written by Joey Van Lierop, Justin Tijunelis

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React from "react";
import { Sensor } from "state";
import "./_styling/manageCard.css";

interface SensorCardProps {
  data: Sensor;
}

export const SensorCard: React.FC<SensorCardProps> = ({ data }) => {
  return (
    <Accordion disableGutters square className="manage-card">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h3>{data.name}</h3>
      </AccordionSummary>
      <AccordionDetails>
        <p>TODO</p>
      </AccordionDetails>
    </Accordion>
  );
};
