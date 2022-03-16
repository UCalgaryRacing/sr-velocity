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
  const context = useContext(DashboardContext);

  switch (context.page) {
    case ManageSection.SENSORS:
      return <div id="manage">{context.page}</div>;
    case ManageSection.OPERATORS:
      return <div id="manage">{context.page}</div>;
    case ManageSection.THINGS:
      return <div id="manage">{context.page}</div>;
    case ManageSection.USERS:
      return <div id="manage">{context.page}</div>;
    default:
      return <></>;
  }
};

export default Manage;
