// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { SensorsAction, SensorsActionType } from "../actions";
import { Sensor, Sensors } from "../types";

const sensorsReducer = (
  state: Sensors | null = null,
  action: SensorsAction
): Sensors | null => {
  switch (action.type) {
    case SensorsActionType.FETCHED: {
      let sensors: Sensors = action.payload;
      return sensors;
    }
    case SensorsActionType.SENSOR_CREATED: {
      let sensors: Sensors = state;
      sensors.push(action.payload);
      return sensors;
    }
    case SensorsActionType.SENSOR_UPDATED: {
      let updated: Sensor = action.payload;
      let sensors: Sensors = [...state].map((sensor) => {
        if (sensor.sid === updated.sid) return updated;
        else return sensor;
      });
      return sensors;
    }
    case SensorsActionType.SENSOR_DELETED: {
      let remove: Sensor = action.payload;
      let sensors: Sensors = [...state].filter(
        (sensor) => sensor.sid !== remove.sid
      );
      return sensors;
    }
    default: {
      return state;
    }
  }
};

export default sensorsReducer;
