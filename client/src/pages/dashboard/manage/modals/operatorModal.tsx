// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { BaseModal } from "components/modals";
import { InputField, TextButton, Alert } from "components/interface";
import { postOperator, putOperator } from "crud";
import { useForm } from "hooks";
import { Operator } from "state";
import { useAppSelector, RootState } from "state";

interface OperatorModalProps {
  show?: boolean;
  toggle: any;
  operator?: Operator;
}

export const OperatorModal: React.FC<OperatorModalProps> = (
  props: OperatorModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const user = useAppSelector((state: RootState) => state.user);
  const [values, handleChange] = useForm(
    props.operator ? props.operator : { name: "" }
  );

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    // TODO: Handle all thing-operator associations
    e.preventDefault();
    setLoading(true);
    if (props.operator) {
      putOperator(values)
        .then((_: any) => {
          setLoading(false);
          props.toggle(values);
        })
        .catch((_: any) => {
          setLoading(false);
          alert("The operator name must be unique. Please try again...");
        });
    } else {
      postOperator({ ...values, organizationId: user?.organizationId })
        .then((operator: Operator) => {
          setLoading(false);
          props.toggle(operator);
        })
        .catch((_: any) => {
          setLoading(false);
          alert("The operator name must be unique. Please try again...");
        });
    }
  };

  return (
    <>
      <BaseModal
        title={props.operator ? "Edit Operator" : "New Operator"}
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
