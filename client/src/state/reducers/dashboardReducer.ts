// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { DashboardAction, DashboardActionType } from "../actions";
import { Dashboard, Thing } from "../types";

const initialDashboard: Dashboard = {
  page: "Real-time Charts",
  thing: undefined,
};

const dashboardReducer = (
  state: Dashboard = initialDashboard,
  action: DashboardAction
): Dashboard => {
  switch (action.type) {
    case DashboardActionType.PAGE_SELECTED: {
      return { ...state, page: action.payload };
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
