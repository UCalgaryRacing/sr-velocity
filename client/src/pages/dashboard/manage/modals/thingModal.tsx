// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { BaseModal } from "components/modals";
import { InputField, TextButton, Alert } from "components/interface";
import { postThing, putThing } from "crud";
import { useForm } from "hooks";
import { Thing } from "state";
import { useAppSelector, RootState } from "state";

interface ThingProps {
  show?: boolean;
  toggle: any;
  thing?: Thing;
}

export const ThingModal: React.FC<ThingProps> = (props: ThingProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const state = useAppSelector((state: RootState) => state);
  const [values, handleChange] = useForm(
    props.thing ? props.thing : { name: "" }
  );

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (props.thing) {
      putThing(values)
        .then((_: any) => {
          setLoading(false);
          props.toggle(values);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409) alert("Thing name must be unique.");
          else alert("Please try again...");
        });
    } else {
      postThing({ ...values, organizationId: state.user?.organizationId })
        .then((thing: Thing) => {
          setLoading(false);
          props.toggle(thing);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409) alert("Thing name must be unique.");
          else alert("Please try again...");
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
