// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect } from "react";
import { BaseModal } from "components/modals";
import {
  InputField,
  TextButton,
  Alert,
  MultiSelect,
} from "components/interface";
import { postOperator, putOperator } from "crud";
import { useForm } from "hooks";
import { Operator, Thing } from "state";

interface OperatorModalProps {
  show?: boolean;
  toggle: any;
  operator?: Operator;
  things: Thing[];
}

export const OperatorModal: React.FC<OperatorModalProps> = (
  props: OperatorModalProps
) => {
  const [thingOptions, setThingOptions] = useState<any[]>([]);
  const [selectedThings, setSelectedThings] = useState<any[]>();
  const [thingIds, setThingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [values, handleChange] = useForm(
    props.operator ? props.operator : { name: "" }
  );

  useEffect(() => {
    if (props.things.length === 0) return;
    let thingOptions = [];
    for (const thing of props.things) {
      thingOptions.push({ key: thing.name, _id: thing._id });
    }
    setThingOptions(thingOptions);
    if (props.operator) {
      let associatedThings = props.things.filter((thing) =>
        props.operator!.thingIds.includes(thing._id)
      );
      let selectedThings = [];
      let thingIds = [];
      for (const thing of associatedThings) {
        selectedThings.push({ key: thing.name, _id: thing._id });
        thingIds.push(thing._id);
      }
      setSelectedThings(selectedThings);
      setThingIds(thingIds);
    }
  }, [props.things, props.operator, props.show]);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (props.operator) {
      let operator = { ...values, thingIds: thingIds };
      putOperator(operator)
        .then((_: any) => {
          setLoading(false);
          props.toggle(operator);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409)
            alert("The Operator name must be unique. Please try again...");
          else alert("Please try again...");
        });
    } else {
      postOperator({
        ...values,
        thingIds: thingIds,
      })
        .then((operator: Operator) => {
          setLoading(false);
          props.toggle(operator);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409)
            alert("The Operator name must be unique. Please try again...");
          else alert("Please try again...");
        });
    }
  };

  const onThingChange = (selectedList: any[], _: any[]) => {
    let thingIds: string[] = [];
    for (let item of selectedList) thingIds.push(item._id);
    setSelectedThings(selectedList);
    setThingIds(thingIds);
  };

  return (
    <>
      <BaseModal
        title={props.operator ? "Edit Operator" : "New Operator"}
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
          required
        />
        <MultiSelect
          placeholder="Things"
          options={thingOptions}
          selectedValues={selectedThings}
          onSelect={onThingChange}
          onRemove={onThingChange}
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
