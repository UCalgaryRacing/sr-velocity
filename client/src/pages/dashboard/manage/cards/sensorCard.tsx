// Copyright Schulich Racing FSAE
// Written by Joey Van Lierop, Justin Tijunelis

import React, { useState } from "react";
import { IconButton, Alert } from "components/interface";
import { CloseOutlined, Edit } from "@mui/icons-material";
import {
  Sensor,
  useAppSelector,
  RootState,
  isAuthAtLeast,
  UserRole,
  Thing,
} from "state";
import { SensorModal } from "../modals/sensorModal";
import { ConfirmModal } from "components/modals";
import { deleteSensor } from "crud";
import { numberToHex, sensorTypes } from "state";

interface SensorCardProps {
  sensor: Sensor;
  thing: Thing;
  onSensorUpdate?: (sensor: Sensor) => void;
  onSensorDelete?: (sensorId: string) => void;
}

export const SensorCard: React.FC<SensorCardProps> = (
  props: SensorCardProps
) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showSensorModal, setShowSensorModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const onDelete = () => {
    setLoading(true);
    deleteSensor(props.sensor._id)
      .then((_: any) => {
        if (props.onSensorDelete) props.onSensorDelete(props.sensor._id);
        setLoading(false);
        setShowConfirmationModal(false);
      })
      .catch((_: any) => {
        setLoading(false);
        setShowAlert(true);
      });
  };

  return (
    <div className="card">
      <div className="card-title">
        <b>{props.sensor.name}</b>
      </div>
      <div>
        <b>Data Type:&nbsp;</b>
        {(() => {
          // @ts-ignore
          return sensorTypes[props.sensor.type];
        })()}
      </div>
      <div>
        <b>Can ID:&nbsp;</b>
        0x{numberToHex(props.sensor.canId).toUpperCase()}
      </div>
      <div>
        <b>Frequency:&nbsp;</b>
        {props.sensor.frequency}
      </div>
      <div>
        <b>Unit:&nbsp;</b>
        {props.sensor.unit ? props.sensor.unit : "N/A"}
      </div>
      <div>
        <b>Lower Bound:&nbsp;</b>
        {props.sensor.lowerBound}
      </div>
      <div>
        <b>Upper Bound:&nbsp;</b>
        {props.sensor.upperBound}
      </div>
      <div>
        <b>Lower Calibration:&nbsp;</b>
        {props.sensor.lowerCalibration ? props.sensor.lowerCalibration : "N/A"}
      </div>
      <div>
        <b>Upper Calibration:&nbsp;</b>
        {props.sensor.upperCalibration ? props.sensor.upperCalibration : "N/A"}
      </div>
      <div>
        <b>Conversion Multiplier:&nbsp;</b>
        {props.sensor.conversionMultiplier
          ? props.sensor.conversionMultiplier
          : "N/A"}
      </div>
      <div>
        <b>Lower Warning:&nbsp;</b>
        {props.sensor.lowerWarning ? props.sensor.lowerWarning : "N/A"}
      </div>
      <div>
        <b>Upper Warning:&nbsp;</b>
        {props.sensor.upperWarning ? props.sensor.upperWarning : "N/A"}
      </div>
      <div>
        <b>Lower Danger:&nbsp;</b>
        {props.sensor.lowerDanger ? props.sensor.lowerDanger : "N/A"}
      </div>
      <div>
        <b>Upper Danger:&nbsp;</b>
        {props.sensor.upperDanger ? props.sensor.upperDanger : "N/A"}
      </div>
      {isAuthAtLeast(user, UserRole.ADMIN) && (
        <>
          <IconButton
            id="card-delete"
            img={<CloseOutlined />}
            onClick={() => setShowConfirmationModal(true)}
          />
          <IconButton
            id="card-edit"
            img={<Edit />}
            onClick={() => setShowSensorModal(true)}
          />
        </>
      )}
      <ConfirmModal
        title={
          "Are you sure you want to delete Sensor '" + props.sensor.name + "'?"
        }
        show={showConfirmationModal}
        toggle={() => setShowConfirmationModal(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <SensorModal
        show={showSensorModal}
        toggle={(sensor: Sensor) => {
          if (props.onSensorUpdate) props.onSensorUpdate(sensor);
          setShowSensorModal(false);
        }}
        sensor={props.sensor}
        thing={props.thing}
      />
      <Alert
        title="Something went wrong..."
        description="Please try again..."
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </div>
  );
};
