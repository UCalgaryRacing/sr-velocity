// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { BaseModal } from "components/modals";
import { InputField, TextButton, Alert } from "components/interface";
import { postThing, putThing } from "crud";
import { useForm } from "hooks";
import { Thing } from "state";
import { useAppSelector, RootState } from "state";

interface ThingModalProps {
  show?: boolean;
  toggle: any;
  thing?: Thing;
}

export const ThingModal: React.FC<ThingModalProps> = (
  props: ThingModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const user = useAppSelector((state: RootState) => state.user);
  const [values, handleChange] = useForm(
    props.thing ? props.thing : { name: "" }
  );

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    // TODO: Handle all thing-operator associations
    e.preventDefault();
    setLoading(true);
    if (props.thing) {
      putThing(values)
        .then((_: any) => {
          setLoading(false);
          props.toggle(values);
        })
        .catch((_: any) => {
          setLoading(false);
          alert("The thing name must be unique. Please try again...");
        });
    } else {
      postThing({ ...values, organizationId: user?.organizationId })
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
