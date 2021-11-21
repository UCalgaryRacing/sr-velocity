// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";

enum ManageSection {
  SENSORS = "Sensors",
  OPERATORS = "Operators",
  THINGS = "Things",
  USERS = "Users",
}

const Manage: React.FC = () => {
  const section = useContext(DashboardContext);

  switch (section) {
    case ManageSection.SENSORS:
      return <div id="manage">{section}</div>;
    case ManageSection.OPERATORS:
      return <div id="manage">{section}</div>;
    case ManageSection.THINGS:
      return <div id="manage">{section}</div>;
    case ManageSection.USERS:
      return <div id="manage">{section}</div>;
    default:
      return <></>;
  }
};

export default Manage;
