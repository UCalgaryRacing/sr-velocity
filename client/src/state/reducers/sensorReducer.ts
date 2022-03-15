// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { SensorAction, SensorActionType } from "../actions";
import { Sensor } from "../types";

const sensorsReducer = (
  state: Sensor[] | null = null,
  action: SensorAction
): Sensor[] | null => {
  if (action.type !== SensorActionType.FETCHED && !state) return state;
  let sensors: Sensor[] = [...(state as Sensor[])];
  switch (action.type) {
    case SensorActionType.FETCHED: {
      return action.payload;
    }
    case SensorActionType.SENSOR_CREATED: {
      sensors.push(action.payload);
      return sensors;
    }
    case SensorActionType.SENSOR_UPDATED: {
      let updated: Sensor = action.payload;
      return sensors.map((sensor) => {
        if (sensor._id === updated._id) return updated;
        else return sensor;
      });
    }
    case SensorActionType.SENSOR_DELETED: {
      let remove: Sensor = action.payload;
      return sensors.filter((sensor) => sensor._id !== remove._id);
    }
    default: {
      return sensors;
    }
  }
};

export default sensorsReducer;
