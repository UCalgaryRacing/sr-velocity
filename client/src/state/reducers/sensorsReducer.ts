// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { SensorsAction, SensorsActionType } from "../actions";
import { Sensor, Sensors } from "../types";

const sensorsReducer = (
  state: Sensors | null = null,
  action: SensorsAction
): Sensors | null => {
  if (action.type !== SensorsActionType.FETCHED && !state) return state;
  let sensors: Sensors = [...(state as Sensors)];
  switch (action.type) {
    case SensorsActionType.FETCHED: {
      return action.payload;
    }
    case SensorsActionType.SENSOR_CREATED: {
      sensors.push(action.payload);
      return sensors;
    }
    case SensorsActionType.SENSOR_UPDATED: {
      let updated: Sensor = action.payload;
      return sensors.map((sensor) => {
        if (sensor.sid === updated.sid) return updated;
        else return sensor;
      });
    }
    case SensorsActionType.SENSOR_DELETED: {
      let remove: Sensor = action.payload;
      return sensors.filter((sensor) => sensor.sid !== remove.sid);
    }
    default: {
      return sensors;
    }
  }
};

export default sensorsReducer;
