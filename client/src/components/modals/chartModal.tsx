// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import { BaseModal } from "components/modals";
import {
  InputField,
  MultiSelect,
  DropDown,
  TextButton,
  Alert,
} from "components/interface";
import { Sensor, Chart, ChartType } from "state";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "hooks";

interface ChartModalProps {
  show?: boolean;
  toggle: any;
  sensors: Sensor[];
  chart?: Chart;
}

export const ChartModal: React.FC<ChartModalProps> = (
  props: ChartModalProps
) => {
  const [sensorOptions, setSensorOptions] = useState<any[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<any[]>([]);
  const [sensorIds, setSensorIds] = useState<string[]>([]);
  const [chartType, setChartType] = useState<ChartType>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [values, handleChange] = useForm(
    props.chart ? props.chart : { name: "" }
  );

  useEffect(() => {
    let options = props.sensors.map((sensor) => {
      return { key: sensor.name, _id: sensor._id };
    });
    setSensorOptions(options);
  }, [props.sensors]);

  useEffect(() => {
    if (props.chart) {
      let selectedSensors = [];
      for (const option of sensorOptions) {
        if (props.chart.sensorIds.includes(option._id)) {
          selectedSensors.push(option);
        }
      }
      setSelectedSensors(selectedSensors);
      setSensorIds(props.chart.sensorIds);
      setChartType(props.chart.type as ChartType);
    }
  }, [sensorOptions, props.chart]);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    let newChart: Chart = {
      _id: uuidv4(),
      name: values.name,
      type: chartType as string,
      sensorIds: sensorIds,
    };
    props.toggle(newChart);
  };

  const onSensorChange = (selectedList: any[], _: any[]) => {
    let sensorIds: string[] = [];
    for (let item of selectedList) sensorIds.push(item._id);
    if (sensorIds.length > 4 && chartType === ChartType.LINE) {
      alert("A Line chart can only have 4 or fewer sensors...");
    } else {
      setSelectedSensors(selectedList);
      setSensorIds(sensorIds);
    }
  };

  return (
    <>
      <BaseModal
        title="New Chart"
        show={props.show}
        toggle={props.toggle}
        onSubmit={onSubmit}
        handleChange={handleChange}
      >
        <InputField
          name="name"
          title="Name"
          value={values.name}
          minLength={4}
          maxLength={20}
          required
        />
        <DropDown
          placeholder="Select Chart Type..."
          options={[
            { value: ChartType.LINE, label: ChartType.LINE },
            { value: ChartType.SCATTER, label: ChartType.SCATTER },
            { value: ChartType.RADIAL, label: ChartType.RADIAL },
          ]}
          onChange={(value: any) => {
            setChartType(value.value);
            if (value.value !== ChartType.LINE) setSensorIds(["", ""]);
            else setSensorIds([]);
            setSelectedSensors([]);
          }}
          defaultValue={
            props.chart
              ? {
                  value: props.chart.type as ChartType,
                  label: props.chart.type as ChartType,
                }
              : undefined
          }
          isSearchable
        />
        {chartType === ChartType.LINE && (
          <MultiSelect
            placeholder="Sensors"
            options={sensorOptions}
            selectedValues={selectedSensors}
            onSelect={onSensorChange}
            onRemove={onSensorChange}
            isSearchable
          />
        )}
        {chartType && chartType !== ChartType.LINE && (
          <>
            <DropDown
              placeholder="Select X-Axis..."
              options={props.sensors.map((sensor: Sensor) => {
                return { value: sensor._id, label: sensor.name };
              })}
              onChange={(value: any) => {
                let ids = { ...sensorIds };
                ids[0] = value.value;
                setSensorIds(ids);
              }}
              isSearchable
            />
            <DropDown
              placeholder="Select Y-Axis..."
              options={props.sensors.map((sensor: Sensor) => {
                return { value: sensor._id, label: sensor.name };
              })}
              onChange={(value: any) => {
                let ids = { ...sensorIds };
                ids[1] = value.value;
                setSensorIds(ids);
              }}
              isSearchable
            />
          </>
        )}
        <TextButton title="Save" />
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
