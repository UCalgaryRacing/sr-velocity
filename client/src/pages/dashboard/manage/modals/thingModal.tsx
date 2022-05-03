// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import { BaseModal } from "components/modals";
import {
  InputField,
  TextButton,
  Alert,
  MultiSelect,
} from "components/interface";
import { postThing, putThing } from "crud";
import { useForm } from "hooks";
import { Thing, Operator } from "state";

interface ThingModalProps {
  show?: boolean;
  toggle: any;
  thing?: Thing;
  operators: Operator[];
}

export const ThingModal: React.FC<ThingModalProps> = (
  props: ThingModalProps
) => {
  const [operatorOptions, setOperatorOptions] = useState<any[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<any[]>([]);
  const [operatorIds, setOperatorIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [values, handleChange] = useForm(
    props.thing ? props.thing : { name: "" }
  );

  useEffect(() => {
    if (props.operators.length === 0) return;
    let operatorOptions = [];
    for (const operator of props.operators) {
      operatorOptions.push({
        key: operator.name,
        _id: operator._id,
      });
    }
    setOperatorOptions(operatorOptions);
    if (props.thing) {
      let associatedOperators = props.operators.filter((operator) =>
        props.thing!.operatorIds.includes(operator._id)
      );
      let selectedOperators = [];
      let operatorIds = [];
      for (const operator of associatedOperators) {
        selectedOperators.push({ key: operator.name, _id: operator._id });
        operatorIds.push(operator._id);
      }
      setSelectedOperators(selectedOperators);
      setOperatorIds(operatorIds);
    }
  }, [props.operators, props.thing]);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (props.thing) {
      let thing = { ...values, operatorIds: operatorIds };
      putThing(thing)
        .then((_: any) => {
          setLoading(false);
          props.toggle(thing);
        })
        .catch((_: any) => {
          setLoading(false);
          alert("The thing name must be unique. Please try again...");
        });
    } else {
      postThing({
        ...values,
        operatorIds: operatorIds,
      })
        .then((thing: Thing) => {
          setLoading(false);
          props.toggle(thing);
        })
        .catch((_: any) => {
          setLoading(false);
          alert("The thing name must be unique. Please try again...");
        });
    }
  };

  const onOperatorChange = (selectedList: any[], _: any[]) => {
    let operatorIds: string[] = [];
    for (let item of selectedList) operatorIds.push(item._id);
    setSelectedOperators(selectedList);
    setOperatorIds(operatorIds);
  };

  return (
    <>
      <BaseModal
        title={props.thing ? "Edit Thing" : "New Thing"}
        show={props.show}
        toggle={props.toggle}
      >
        <InputField
          name="name"
          title="Name"
          value={values.name}
          onChange={handleChange}
          minLength={4}
          required
        />
        <MultiSelect
          placeholder="Operators"
          options={operatorOptions}
          selectedValues={selectedOperators}
          onSelect={onOperatorChange}
          onRemove={onOperatorChange}
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
