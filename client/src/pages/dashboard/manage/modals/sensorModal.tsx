// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import { BaseModal } from "components/modals";
import { InputField, TextButton, Alert, DropDown } from "components/interface";
import { postSensor, putSensor } from "crud";
import { useForm } from "hooks";
import { Sensor, numberToHex } from "state";

interface SensorModalProps {
  show?: boolean;
  toggle: any;
  sensor?: Sensor;
}

const initialValues = {
  name: "",
  type: "",
  category: "",
  canId: "0x00000000",
  frequency: "",
  unit: "",
  lowerCalibration: "",
  upperCalibration: "",
  conversionMultiplier: "",
  lowerWarning: "",
  upperWarning: "",
  lowerDanger: "",
  upperDanger: "",
  disabled: false,
};

export const SensorModal: React.FC<SensorModalProps> = (
  props: SensorModalProps
) => {
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [values, handleChange] = useForm(
    props.sensor
      ? { ...props.sensor, canId: numberToHex(props.sensor.canId) }
      : initialValues
  );

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onTypeSelected = () => {};

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (props.sensor) {
      // put
    } else {
      // post
    }
  };

  return (
    <>
      <BaseModal
        title={props.sensor ? "Edit Sensor" : "New Sensor"}
        show={props.show}
        toggle={props.toggle}
      >
        <InputField
          name="name"
          title="Name"
          value={values.name}
          onChange={handleChange}
          required
        />
        {/* Need dropdown for type */}
        <InputField
          name="category"
          placeholder="Category"
          value={values.category}
          onChange={handleChange}
        />
        <InputField
          name="canId"
          placeholder="CAN ID"
          pattern="0[xX][0-9a-fA-F]+"
          value={values.canId}
          onChange={handleChange}
          required
        />
        <InputField
          name="frequency"
          placeholder="Frequency"
          type="number"
          value={values.frequency}
          onChange={handleChange}
          required
        />
        <InputField
          name="unit"
          placeholder="Unit"
          value={values.unit}
          onChange={handleChange}
        />
        <InputField
          name="lowerCalibration"
          placeholder="Lower Calibration"
          type="number"
          value={values.lowerCalibration}
          onChange={handleChange}
        />
        <InputField
          name="upperCalibration"
          placeholder="Upper Calibration"
          type="number"
          value={values.upperCalibration}
          onChange={handleChange}
        />
        <InputField
          name="conversionMultiplier"
          placeholder="Conversion Multiplier"
          type="number"
          value={values.conversionMultiplier}
          onChange={handleChange}
        />
        <InputField
          name="lowerWarning"
          placeholder="Lower Warning"
          type="number"
          value={values.lowerWarning}
          onChange={handleChange}
        />
        <InputField
          name="upperWarning"
          placeholder="Upper Warning"
          type="number"
          value={values.lowerWarning}
          onChange={handleChange}
        />
        <InputField
          name="lowerDanger"
          placeholder="Lower Danger"
          type="number"
          value={values.lowerDanger}
          onChange={handleChange}
        />
        <InputField
          name="upperDanger"
          placeholder="Upper Danger"
          type="number"
          value={values.upperDanger}
          onChange={handleChange}
        />
        <TextButton title="Save" onClick={onSubmit} loading={loading} />
      </BaseModal>
      <Alert
        title="Something went wrong..."
        description={alertDescription}
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </>
  );
};
