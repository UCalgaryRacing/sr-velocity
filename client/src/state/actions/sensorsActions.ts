// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Dispatch } from "redux";
import { Sensor, Sensors } from "../types";

export enum SensorsActionType {
  FETCHED = "sensorsFetched",
  SENSOR_CREATED = "sensorCreated",
  SENSOR_UPDATED = "sensorUpdated",
  SENSOR_DELETED = "sensorDeleted",
}

interface SensorsFetchedAction {
  type: SensorsActionType.FETCHED;
  payload: Sensors;
}

interface SensorCreatedAction {
  type: SensorsActionType.SENSOR_CREATED;
  payload: Sensor;
}

interface SensorUpdatedAction {
  type: SensorsActionType.SENSOR_UPDATED;
  payload: Sensor;
}

interface SensorDeletedAction {
  type: SensorsActionType.SENSOR_DELETED;
  payload: Sensor;
}

export type SensorsAction =
  | SensorsFetchedAction
  | SensorCreatedAction
  | SensorUpdatedAction
  | SensorDeletedAction;

export const sensorsFetched = (sensors: Sensors) => {
  return (dispatch: Dispatch<SensorsFetchedAction>) => {
    dispatch({
      type: SensorsActionType.FETCHED,
      payload: sensors,
    });
  };
};

export const sensorCreated = (sensor: Sensor) => {
  return (dispatch: Dispatch<SensorCreatedAction>) => {
    dispatch({
      type: SensorsActionType.SENSOR_CREATED,
      payload: sensor,
    });
  };
};

export const sensorUpdated = (sensor: Sensor) => {
  return (dispatch: Dispatch<SensorUpdatedAction>) => {
    dispatch({
      type: SensorsActionType.SENSOR_UPDATED,
      payload: sensor,
    });
  };
};

export const sensorDeleted = (sensor: Sensor) => {
  return (dispatch: Dispatch<SensorDeletedAction>) => {
    dispatch({
      type: SensorsActionType.SENSOR_DELETED,
      payload: sensor,
    });
  };
};
