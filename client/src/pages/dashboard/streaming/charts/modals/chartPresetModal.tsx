// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { BaseModal } from "components/modals";
import { InputField, TextButton, Alert } from "components/interface";
import { Chart, ChartPreset, Thing } from "state";
import { useForm } from "hooks";
import { postChartPreset, putChartPreset } from "crud";

interface ChartPresetModalProps {
  show: boolean;
  toggle: any;
  chartPreset?: ChartPreset;
  charts: Chart[];
  thing: Thing;
}

export const ChartPresetModal: React.FC<ChartPresetModalProps> = (
  props: ChartPresetModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [values, handleChange] = useForm(
    props.chartPreset ? props.chartPreset : { name: "" }
  );

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (props.chartPreset) {
      let preset = {
        ...values,
        charts: props.charts, // Do we need to remove temp Ids?
      };
      // TODO: We need to get the entire thing back...
      putChartPreset(preset)
        .then((_: any) => {
          setLoading(false);
          props.toggle(preset);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409)
            alert("The Preset name must be unique. Please try again...");
          else alert("Please try again...");
        });
    } else {
      postChartPreset({
        ...values,
        charts: props.charts, // Do we need to remove temp Ids?
        thingId: props.thing._id,
      })
        .then((preset: ChartPreset) => {
          setLoading(false);
          props.toggle(preset);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409)
            alert("The Preset name must be unique. Please try again...");
          else alert("Please try again...");
        });
    }
  };

  return (
    <>
      <BaseModal
        title={props.chartPreset ? "Edit Chart Preset" : "New Chart Preset"}
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
