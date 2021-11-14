// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import {
  DashboardAction,
  DashboardActionType,
} from "../actions/dashboardActions";
import { Dashboard } from "../types";

const dashboardReducer = (
  state: Dashboard | null = null,
  action: DashboardAction
): Dashboard | null => {
  switch (action.type) {
    case DashboardActionType.PAGE_SELECTED:
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;
