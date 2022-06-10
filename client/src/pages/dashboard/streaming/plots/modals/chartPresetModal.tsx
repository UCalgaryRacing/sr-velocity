// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { BaseModal, ConfirmModal } from "components/modals";
import { InputField, TextButton, Alert } from "components/interface";
import { Chart, ChartPreset, Thing } from "state";
import { useForm } from "hooks";
import { postChartPreset, putChartPreset, deleteChartPreset } from "crud";

interface ChartPresetModalProps {
  show: boolean;
  toggle: any;
  chartPreset?: ChartPreset;
  charts: Chart[];
  thing: Thing;
  onDelete: (chartPresetId: string) => void;
}

export const ChartPresetModal: React.FC<ChartPresetModalProps> = (
  props: ChartPresetModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [values, handleChange] = useForm(
    props.chartPreset ? { ...props.chartPreset } : { name: "" }
  );

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (values.name.includes("New Preset")) {
      alert("The Preset name must be unique. Please try again...");
      return;
    }
    setLoading(true);
    const cleanedCharts = props.charts.map((chart) => {
      // @ts-ignore
      delete chart["_id"];
      return chart;
    });
    if (props.chartPreset) {
      let preset = {
        ...values,
        charts: cleanedCharts,
      };
      putChartPreset(preset)
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
    } else {
      postChartPreset({
        ...values,
        charts: cleanedCharts,
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

  const onDelete = () => {
    setDeleteLoading(true);
    deleteChartPreset(props.chartPreset!._id)
      .then((_: any) => {
        setDeleteLoading(false);
        if (props.onDelete) props.onDelete(props.chartPreset!._id);
        props.toggle();
      })
      .catch((_: any) => {
        setDeleteLoading(false);
        alert("Please try again...");
      });
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
          onChange={handleChange}
          minLength={1}
          maxLength={20}
          required
        />
        <TextButton title="Save" loading={loading} />
        {props.chartPreset && (
          <TextButton
            type="button"
            title="Delete"
            onClick={() => setShowConfirmation(true)}
          />
        )}
      </BaseModal>
      {props.chartPreset && (
        <ConfirmModal
          title={
            "Are you sure you want to delete Preset '" +
            props.chartPreset.name +
            "'?"
          }
          show={showConfirmation}
          toggle={() => setShowConfirmation(false)}
          onConfirm={onDelete}
          loading={deleteLoading}
        />
      )}
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
