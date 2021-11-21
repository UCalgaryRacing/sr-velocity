// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Dispatch } from "redux";
import { Vehicle } from "state";

export enum DashboardActionType {
  PAGE_SELECTED = "pageSelected",
  VEHICLE_SELECTED = "vehicleSelected",
}

interface DashboardPageSelectedAction {
  type: DashboardActionType.PAGE_SELECTED;
  payload: string;
}

interface DashboardVehicleSelectedAction {
  type: DashboardActionType.VEHICLE_SELECTED;
  payload: Vehicle;
}

export type DashboardAction =
  | DashboardPageSelectedAction
  | DashboardVehicleSelectedAction;

export const dashboardPageSelected = (page: string) => {
  return (dispatch: Dispatch<DashboardPageSelectedAction>) => {
    dispatch({
      type: DashboardActionType.PAGE_SELECTED,
      payload: page,
    });
  };
};

export const dashboardVehicleSelected = (vehicle: Vehicle) => {
  return (dispatch: Dispatch<DashboardVehicleSelectedAction>) => {
    dispatch({
      type: DashboardActionType.VEHICLE_SELECTED,
      payload: vehicle,
    });
  };
};
