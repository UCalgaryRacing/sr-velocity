// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis and Joey Van Lierop

import React, { useContext } from "react";
import { DashboardContext } from "../dashboard";
import {
  ManageOrganization,
  ManageProfile,
  ManageUsers,
  ManageThings,
  ManageSensors,
  ManageOperators,
} from "./sections";
import "./_styling/manage.css";

enum ManageSection {
  ORGANIZATION = "Organization",
  PROFILE = "Profile",
  USERS = "Users",
  THINGS = "Things",
  SENSORS = "Sensors",
  OPERATORS = "Operators",
}

const Manage: React.FC = () => {
  const context = useContext(DashboardContext);

  switch (context.page) {
    case ManageSection.ORGANIZATION:
      return <ManageOrganization />;
    case ManageSection.PROFILE:
      return <ManageProfile />;
    case ManageSection.USERS:
      return <ManageUsers />;
    case ManageSection.THINGS:
      return <ManageThings />;
    case ManageSection.SENSORS:
      return <ManageSensors />;
    case ManageSection.OPERATORS:
      return <ManageOperators />;
    default:
      return <></>;
  }
};

export default Manage;
