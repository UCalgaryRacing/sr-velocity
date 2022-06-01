// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import {
  InputField,
  DropDown,
  TextButton,
  Alert,
  DropZone,
  DateTime,
} from "components/interface";
import { BaseModal } from "components/modals";
import { Session, Collection, Operator, Thing } from "state";
import { useForm } from "hooks";

interface SessionModalProps {
  show?: boolean;
  toggle: any;
  thing: Thing;
  session?: Session;
  collections: Collection[];
  operators: Operator[];
}

export const SessionModal: React.FC<SessionModalProps> = (
  props: SessionModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [collectionId, setCollectionId] = useState<string>("");
  const [operatorId, setOperatorId] = useState<string>("");
  const [values, handleChange] = useForm(
    props.session
      ? props.session
      : { name: "", collectionId: null, operatorId: null }
  );

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = () => {
    if (!startTime || !endTime) {
      alert("The session must have a start and end time.");
      return;
    }

    if (startTime.getTime() > endTime.getTime()) {
      alert("The end time must be after the start time.");
      return;
    }

    // Create the session, then upload the file
  };

  return (
    <>
      <BaseModal
        title={props.session ? "Edit Session" : "New Session"}
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
        <DateTime value={startTime} onChange={setStartTime} />
        <DateTime value={endTime} onChange={setEndTime} />
        {props.collections.length > 0 && (
          <DropDown
            placeholder="Select Collection..."
            options={(() => {
              let options = [{ value: undefined, label: "None" }];
              let collections = props.collections.map((c) => {
                return { value: c._id, label: c.name };
              });
              // @ts-ignore
              options = options.concat(collections);
              return options;
            })()}
            value={(() => {
              let c = props.collections.filter(
                (c) => c._id === values.collectionId
              );
              if (c.length === 1) return { value: c[0]._id, label: c[0].name };
              else return null;
            })()}
            onChange={(value: any) => {
              values.collectionId = value.value;
              setCollectionId(value.value);
            }}
            isSearchable
          />
        )}
        {props.operators.length > 0 && (
          <DropDown
            placeholder="Select Operator..."
            options={(() => {
              let options = [{ value: undefined, label: "None" }];
              let operators = props.operators.map((o) => {
                return { value: o._id, label: o.name };
              });
              // @ts-ignore
              options = options.concat(operators);
              return options;
            })()}
            value={(() => {
              let o = props.operators.filter(
                (o) => o._id === values.operatorId
              );
              if (o.length === 1) return { value: o[0]._id, label: o[0].name };
              else return null;
            })()}
            onChange={(value: any) => {
              values.operatorId = value.value;
              setOperatorId(value.value);
            }}
            isSearchable
          />
        )}
        <DropZone />
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
