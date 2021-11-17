// Copyright Schulich Racing FSAE
// Written by Ryan Painchaud, Justin Tijunelis

// Can this, sensors, and vehicles be concatenated somehow?

import { Dispatch } from "redux";
import { Driver } from "../types";

export enum DriverActionType {
  FETCHED = "driversFetched",
  DRIVER_CREATED = "driverCreated",
  DRIVER_UPDATED = "driverUpdated",
  DRIVER_DELETED = "driverDeleted",
}

interface DriversFetchedAction {
  type: DriverActionType.FETCHED;
  payload: Driver[];
}

interface DriverCreatedAction {
  type: DriverActionType.DRIVER_CREATED;
  payload: Driver;
}

interface DriverUpdatedAction {
  type: DriverActionType.DRIVER_UPDATED;
  payload: Driver;
}

interface DriverDeletedAction {
  type: DriverActionType.DRIVER_DELETED;
  payload: Driver;
}

export type DriverAction =
  | DriversFetchedAction
  | DriverCreatedAction
  | DriverUpdatedAction
  | DriverDeletedAction;

export const driversFetched = (drivers: Driver[]) => {
  return (dispatch: Dispatch<DriversFetchedAction>) => {
    dispatch({
      type: DriverActionType.FETCHED,
      payload: drivers,
    });
  };
};

export const driverCreated = (driver: Driver) => {
  return (dispatch: Dispatch<DriverCreatedAction>) => {
    dispatch({
      type: DriverActionType.DRIVER_CREATED,
      payload: driver,
    });
  };
};

export const driverUpdated = (driver: Driver) => {
  return (dispatch: Dispatch<DriverUpdatedAction>) => {
    dispatch({
      type: DriverActionType.DRIVER_UPDATED,
      payload: driver,
    });
  };
};

export const driverDeleted = (driver: Driver) => {
  return (dispatch: Dispatch<DriverDeletedAction>) => {
    dispatch({
      type: DriverActionType.DRIVER_DELETED,
      payload: driver,
    });
  };
};
