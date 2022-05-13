// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { BaseModal } from "components/modals";
import {
  InputField,
  TextButton,
  Alert,
  DropDown,
  SegmentedControl,
} from "components/interface";
import { postSensor, putSensor } from "crud";
import { useForm } from "hooks";
import { Sensor, Thing, numberToHex, hexToNumber, sensorTypes } from "state";

interface SensorModalProps {
  show?: boolean;
  toggle: any;
  sensor?: Sensor;
  thing: Thing;
}

const initialValues = {
  name: "",
  type: "",
  category: "",
  canId: "0x",
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

const numberFields = [
  "frequency",
  "lowerCalibration",
  "upperCalibration",
  "conversionMultiplier",
  "lowerWarning",
  "upperWarning",
  "lowerDanger",
  "upperDanger",
];

export const SensorModal: React.FC<SensorModalProps> = (
  props: SensorModalProps
) => {
  const [type, setType] = useState<string>(
    props.sensor ? props.sensor.type : ""
  );
  const [disabled, setDisabled] = useState<boolean>(false);
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

  const cleanSensor = (sensor: any) => {
    let cleaned = { ...sensor };
    for (const key of numberFields) cleaned[key] = Number(cleaned[key]);
    return cleaned;
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    let canIdValid =
      (values.canId.length === 8 || values.canId.length === 10) &&
      !(values.canId.length === 8 && !/[0-9a-fA-F]{8}/.test(values.canId)) &&
      !(
        values.canId.length === 10 && !/0[xX][0-9a-fA-F]{8}/.test(values.canId)
      );
    if (!canIdValid || Number(values.canId) === 0) {
      alert("Please provide a valid CAN ID.");
      return;
    }
    if (type === "") {
      alert("Please select a type for the Sensor.");
      return;
    }
    setLoading(true);
    if (props.sensor) {
      let sensor = cleanSensor({
        ...props.sensor,
        ...values,
        canId: hexToNumber(values.canId),
        disabled: disabled,
      });
      putSensor(sensor)
        .then((_: any) => {
          setLoading(false);
          props.toggle(sensor);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409)
            alert(
              "The Sensor name and CAN ID must be unique. Please try again..."
            );
          else alert("Please try again...");
        });
    } else {
      let sensor = cleanSensor({
        ...values,
        canId: hexToNumber(values.canId),
        type: type,
        thingId: props.thing._id,
        disabled: disabled,
      });
      console.log(sensor);
      postSensor(sensor)
        .then((sensor: Sensor) => {
          setLoading(false);
          props.toggle(sensor);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409)
            alert(
              "The Sensor name and CAN ID must be unique. Please try again..."
            );
          else alert("Please try again...");
        });
    }
  };

  return (
    <>
      <BaseModal
        title={props.sensor ? "Edit Sensor" : "New Sensor"}
        show={props.show}
        toggle={props.toggle}
        onSubmit={onSubmit}
        handleChange={handleChange}
      >
        <InputField
          name="name"
          title="Name"
          value={values.name}
          onChange={handleChange}
          minLength={4}
          maxLength={20}
          required
        />
        <DropDown
          placeholder="Sensor Type"
          options={(() => {
            let options: any[] = [];
            for (const [key, value] of Object.entries(sensorTypes))
              options.push({ value: key, label: value });
            return options;
          })()}
          onChange={(value: any) => setType(value.value)}
          defaultValue={(() => {
            return props.sensor
              ? {
                  value: props.sensor.type,
                  // @ts-ignore
                  label: sensorTypes[props.sensor.type],
                }
              : null;
          })()}
          isSearchable
        />
        <InputField
          name="category"
          title="Category"
          value={values.category}
          minLength={4}
          maxLength={20}
          onChange={handleChange}
        />
        <InputField
          name="canId"
          title="CAN ID ([0x]########)"
          value={values.canId}
          minLength={8}
          maxLength={10}
          onChange={handleChange}
          required
        />
        <InputField
          name="frequency"
          title="Frequency"
          type="number"
          value={values.frequency}
          onChange={handleChange}
          required
        />
        <InputField
          name="unit"
          title="Unit"
          value={values.unit}
          maxLength={10}
          onChange={handleChange}
        />
        <InputField
          name="lowerCalibration"
          title="Lower Calibration"
          type="number"
          value={values.lowerCalibration}
          onChange={handleChange}
        />
        <InputField
          name="upperCalibration"
          title="Upper Calibration"
          type="number"
          value={values.upperCalibration}
          onChange={handleChange}
        />
        <InputField
          name="conversionMultiplier"
          title="Conversion Multiplier"
          type="number"
          value={values.conversionMultiplier}
          onChange={handleChange}
        />
        <InputField
          name="lowerWarning"
          title="Lower Warning"
          type="number"
          value={values.lowerWarning}
          onChange={handleChange}
        />
        <InputField
          name="upperWarning"
          title="Upper Warning"
          type="number"
          value={values.lowerWarning}
          onChange={handleChange}
        />
        <InputField
          name="lowerDanger"
          title="Lower Danger"
          type="number"
          value={values.lowerDanger}
          onChange={handleChange}
        />
        <InputField
          name="upperDanger"
          title="Upper Danger"
          type="number"
          value={values.upperDanger}
          onChange={handleChange}
        />
        <SegmentedControl
          name="sensor-toggle"
          options={[
            {
              label: "Enabled",
              value: false,
              default: props.sensor ? !props.sensor.disabled : true,
            },
            {
              label: "Disabled",
              value: true,
              default: props.sensor ? props.sensor.disabled : false,
            },
          ]}
          onChange={setDisabled}
        />
        <TextButton title="Save" loading={loading} />
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
