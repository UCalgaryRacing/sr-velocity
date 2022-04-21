// Copyright Schulich Racing, FSAE
// Written by Joey Van Lierop, Justin Tijunelis

import React, { useState, useEffect, useContext } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import DashNav from "components/navigation/dashNav";
import ManageNav from "../manageNav";
import { RootState, Sensor, useAppSelector } from "state";

const initialForm = {
  type: "",
  category: "",
  name: "",
  frequency: "",
  unit: "",
  canId: "",
  lowerCalibration: "",
  conversionMultiplier: "",
  upperWarning: "",
  lowerWarning: "",
  upperDanger: "",
  lowerDanger: "",
  disabled: false,
};

export const ManageSensors: React.FC = () => {
  const context = useContext(DashboardContext);
  const dashboard = useAppSelector((state: RootState) => state.dashboard);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [sensorCards, setSensorCards] = useState<any>([]);

  useEffect(() => {
    // Fetch sensors
    // We need to know the thing in the dashboard
  }, []);

  const onNewSensor = () => {
    // Make request to post the sensor
    // On success, add a new card in the correct order
  };

  return (
    <div id="manage-sensors">
      <DashNav margin={context.margin}>
        <ManageNav onAddCard={onNewSensor} />
      </DashNav>
    </div>
  );
};
