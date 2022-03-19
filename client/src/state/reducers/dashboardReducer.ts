// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { DashboardAction, DashboardActionType } from "../actions";
import { Dashboard, Thing } from "../types";

const initialDashboard: Dashboard = {
  section: "Streaming",
  page: "Real-Time Charts",
  thing: undefined, // Default thing
};

const dashboardReducer = (
  state: Dashboard = initialDashboard,
  action: DashboardAction
): Dashboard => {
  switch (action.type) {
    case DashboardActionType.PAGE_SELECTED: {
      return { ...state, ...action.payload };
    }
    case DashboardActionType.VEHICLE_SELECTED: {
      return { ...state, thing: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default dashboardReducer;
