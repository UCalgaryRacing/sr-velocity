// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import { BaseModal } from "components/modals";
import { TextButton, MultiSelect } from "components/interface";
import { Sensor } from "state";

interface NewRawBoxModalProps {
  show: boolean;
  toggle: any;
  sensors: Sensor[];
}

export const NewRawBoxModal: React.FC<NewRawBoxModalProps> = (
  props: NewRawBoxModalProps
) => {
  const [sensorOptions, setSensorOptions] = useState<any[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<any[]>([]);

  useEffect(() => {
    let sensorOptions = [];
    for (const sensor of props.sensors)
      sensorOptions.push({ key: sensor.name, value: sensor });
    setSensorOptions(sensorOptions);
  }, [props.sensors, props.show]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    props.toggle(selectedSensors.map((value) => value.value));
  };

  const onSensorChange = (selectedList: any[], _: any[]) => {
    setSelectedSensors(selectedList);
  };

  return (
    <BaseModal
      title="Add Boxes"
      show={props.show}
      toggle={props.toggle}
      onSubmit={onSubmit}
    >
      {sensorOptions.length !== 0 ? (
        <MultiSelect
          placeholder="Sensors"
          options={sensorOptions}
          selectedValues={selectedSensors}
          onSelect={onSensorChange}
          onRemove={onSensorChange}
        />
      ) : (
        "No sensors available..." // TODO: Make this look nice...
      )}
      <TextButton title="Save" />
    </BaseModal>
  );
};
