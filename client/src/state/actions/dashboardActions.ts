// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Dispatch } from "redux";
import { Thing } from "state";

export enum DashboardActionType {
  PAGE_SELECTED = "pageSelected",
  VEHICLE_SELECTED = "vehicleSelected",
}

interface DashboardPageSelectedAction {
  type: DashboardActionType.PAGE_SELECTED;
  payload: any;
}

interface DashboardVehicleSelectedAction {
  type: DashboardActionType.VEHICLE_SELECTED;
  payload: Thing;
}

export type DashboardAction =
  | DashboardPageSelectedAction
  | DashboardVehicleSelectedAction;

export const dashboardPageSelected = (selection: any) => {
  return (dispatch: Dispatch<DashboardPageSelectedAction>) => {
    dispatch({
      type: DashboardActionType.PAGE_SELECTED,
      payload: selection,
    });
  };
};

export const dashboardVehicleSelected = (vehicle: Thing) => {
  return (dispatch: Dispatch<DashboardVehicleSelectedAction>) => {
    dispatch({
      type: DashboardActionType.VEHICLE_SELECTED,
      payload: vehicle,
    });
  };
};
