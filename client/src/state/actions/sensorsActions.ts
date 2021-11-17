// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Dispatch } from "redux";
import { Sensor } from "../types";

export enum SensorActionType {
  FETCHED = "sensorsFetched",
  SENSOR_CREATED = "sensorCreated",
  SENSOR_UPDATED = "sensorUpdated",
  SENSOR_DELETED = "sensorDeleted",
}

interface SensorsFetchedAction {
  type: SensorActionType.FETCHED;
  payload: Sensor[];
}

interface SensorCreatedAction {
  type: SensorActionType.SENSOR_CREATED;
  payload: Sensor;
}

interface SensorUpdatedAction {
  type: SensorActionType.SENSOR_UPDATED;
  payload: Sensor;
}

interface SensorDeletedAction {
  type: SensorActionType.SENSOR_DELETED;
  payload: Sensor;
}

export type SensorAction =
  | SensorsFetchedAction
  | SensorCreatedAction
  | SensorUpdatedAction
  | SensorDeletedAction;

export const sensorsFetched = (sensors: Sensor[]) => {
  return (dispatch: Dispatch<SensorsFetchedAction>) => {
    dispatch({
      type: SensorActionType.FETCHED,
      payload: sensors,
    });
  };
};

export const sensorCreated = (sensor: Sensor) => {
  return (dispatch: Dispatch<SensorCreatedAction>) => {
    dispatch({
      type: SensorActionType.SENSOR_CREATED,
      payload: sensor,
    });
  };
};

export const sensorUpdated = (sensor: Sensor) => {
  return (dispatch: Dispatch<SensorUpdatedAction>) => {
    dispatch({
      type: SensorActionType.SENSOR_UPDATED,
      payload: sensor,
    });
  };
};

export const sensorDeleted = (sensor: Sensor) => {
  return (dispatch: Dispatch<SensorDeletedAction>) => {
    dispatch({
      type: SensorActionType.SENSOR_DELETED,
      payload: sensor,
    });
  };
};
