// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import { BaseModal } from "components/modals";
import {
  InputField,
  TextButton,
  Alert,
  SegmentedControl,
} from "components/interface";
import { postSensor, putSensor } from "crud";
import { useForm } from "hooks";
import { Sensor, Thing, numberToHex, hexToNumber } from "state";

interface SensorModalProps {
  show?: boolean;
  toggle: any;
  sensor?: Sensor;
  thing: Thing;
}

const initialValues = {
  name: "",
  type: "",
  canId: "0x",
  canOffset: "0",
  frequency: "",
  unit: "",
  lowerBound: "",
  upperBound: "",
  lowerCalibration: "",
  upperCalibration: "",
  conversionMultiplier: "",
  lowerWarning: "",
  upperWarning: "",
  lowerDanger: "",
  upperDanger: "",
};

const numberFields = [
  "frequency",
  "canOffset",
  "lowerCalibration",
  "upperCalibration",
  "conversionMultiplier",
  "lowerWarning",
  "upperWarning",
  "lowerDanger",
  "upperDanger",
  "lowerBound",
  "upperBound",
];

export const SensorModal: React.FC<SensorModalProps> = (
  props: SensorModalProps
) => {
  const [type, setType] = useState<string>(
    props.sensor ? props.sensor.type : ""
  );
  const [numberType, setNumberType] = useState<string>();
  const [precision, setPrecision] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [values, handleChange] = useForm(
    props.sensor
      ? {
          ...props.sensor,
          canId: "0x" + numberToHex(props.sensor.canId).toUpperCase(),
        }
      : initialValues
  );

  useEffect(() => {
    if (props.sensor) {
      const decimals = ["d", "f"];
      if (decimals.includes(props.sensor.type)) {
        setNumberType("Decimal");
        setPrecision(props.sensor.type === "f" ? 7 : 15);
      } else if (props.sensor.type === "?") {
        setNumberType("On/Off");
      } else {
        setNumberType("Discrete");
      }
      let lower = Number(props.sensor.lowerBound);
      let upper = Number(props.sensor.upperBound);
      setType(findOptimalType(lower, upper));
    }
  }, []);

  useEffect(() => {
    if (values.lowerBound !== "" && values.upperBound !== "") {
      let lower = Number(values.lowerBound);
      let upper = Number(values.upperBound);
      if (lower >= upper) {
        alert("The lower bound must be less than the upper bound.");
      } else setType(findOptimalType(lower, upper));
    }
  }, [values, numberType, precision]);

  const findOptimalType = (lower: number, upper: number) => {
    let type = "?";
    const BYTE1_MAX = 2 ** 8 - 1;
    const BYTE2_MAX = 2 ** 16 - 1;
    const BYTE4_MAX = 2 ** 32 - 1;
    const BYTE8_MAX = 2 ** 64 - 1;
    const FLOAT_MAX = 3.402823466e38;
    if (numberType === "Decimal") {
      if (precision === 15) {
        type = "d";
      } else {
        if (Math.abs(lower) <= FLOAT_MAX || Math.abs(upper) <= FLOAT_MAX)
          type = "f";
        else {
          setPrecision(15);
          type = "d";
        }
      }
    } else if (numberType === "Discrete" && lower < 0) {
      if (lower < 0) {
        const absLower = Math.abs(lower);
        const absUpper = Math.abs(upper);
        if (absLower <= BYTE1_MAX / 2 && absUpper <= BYTE1_MAX / 2) type = "c";
        else if (absLower <= BYTE2_MAX / 2 && absUpper <= BYTE2_MAX / 2)
          type = "h";
        else if (absLower <= BYTE4_MAX / 2 && absUpper <= BYTE4_MAX / 2)
          type = "i";
        else if (absLower <= BYTE8_MAX / 2 && absUpper <= BYTE8_MAX / 2)
          type = "q";
        else {
          alert(
            "The upper and/or lower bound is too large, it must be less that 2^63."
          );
          type = "";
        }
      }
    } else if (numberType === "Discrete" && lower >= 0) {
      if (upper <= BYTE1_MAX) type = "B";
      else if (upper <= BYTE2_MAX) type = "H";
      else if (upper <= BYTE4_MAX) type = "I";
      else if (upper <= BYTE8_MAX) type = "Q";
      else {
        alert("The upper bound is to large, it must be less than 2^64.");
        type = "";
      }
    }
    return type;
  };

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const cleanSensor = (sensor: any) => {
    let cleaned = { ...sensor };
    for (const key of numberFields) {
      if (cleaned[key] == "") cleaned[key] = null;
      else cleaned[key] = Number(cleaned[key]);
    }
    return cleaned;
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    let canIdValid =
      /[0-9a-fA-F]/.test(values.canId) || /0[xX][0-9a-fA-F]/.test(values.canId);
    if (!canIdValid) {
      alert("Please provide a valid CAN ID.");
      return;
    }
    if (type === "") {
      alert("Please select a type for the Sensor.");
      return;
    }
    if (props.sensor) {
      let sensor = cleanSensor({
        ...props.sensor,
        ...values,
        type: type,
        canId: hexToNumber(values.canId),
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
      });
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
          minLength={2}
          maxLength={30}
          required
        />
        <InputField
          name="canId"
          title="CAN ID ([0x]########)"
          value={values.canId}
          minLength={1}
          maxLength={10}
          onChange={handleChange}
          required
        />
        <InputField
          name="canOffset"
          title="CAN Offset"
          type="number"
          value={values.canOffset}
          min={0}
          max={7}
          onChange={handleChange}
          required
        />
        <InputField
          name="frequency"
          title="Frequency (Hz)"
          type="number"
          min={1}
          max={120}
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
        <SegmentedControl
          name="Value Type"
          options={[
            {
              label: "Decimal",
              value: "Decimal",
              default: numberType ? numberType === "Decimal" : true,
            },
            {
              label: "Discrete",
              value: "Discrete",
              default: numberType ? numberType === "Discrete" : false,
            },
            {
              label: "On/Off",
              value: "On/Off",
              default: numberType ? numberType === "On/Off" : false,
            },
          ]}
          onChange={(value: any) => {
            setNumberType(value);
            if (value === "On/Off") {
              values.lowerBound = "0";
              values.upperBound = "1";
              setPrecision(undefined);
            }
          }}
        />
        {numberType === "Decimal" && (
          <SegmentedControl
            name="Precision"
            options={[
              {
                label: "7 Decimals",
                value: 7,
                default: precision ? precision === 7 : true,
              },
              {
                label: "15 Decimals",
                value: 15,
                default: precision ? precision === 15 : false,
              },
            ]}
            onChange={(value: any) => setPrecision(value)}
          />
        )}
        {numberType !== "On/Off" && (
          <div className="compressed-form">
            <InputField
              name="lowerBound"
              title="Lower Bound"
              type="number"
              value={values.lowerBound}
              onChange={handleChange}
              required
            />
            <InputField
              name="upperBound"
              title="Upper Bound"
              type="number"
              value={values.upperBound}
              onChange={handleChange}
              required
            />
          </div>
        )}
        {numberType !== "On/Off" && (
          <>
            <div className="compressed-form">
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
                value={values.upperWarning}
                onChange={handleChange}
              />
            </div>
            <div className="compressed-form">
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
            </div>
          </>
        )}
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
