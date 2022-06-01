// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { InputField, DropDown, TextButton, Alert } from "components/interface";
import { BaseModal } from "components/modals";
import { Session, Collection } from "state";
import { useForm } from "hooks";

interface SessionModalProps {
  show?: boolean;
  toggle: any;
  session?: Session;
  collections: Collection[];
}

export const SessionModal: React.FC<SessionModalProps> = (
  props: SessionModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [collectionId, setCollectionId] = useState<string>(
    props.session ? props.session.collectionId : ""
  );
  const [values, handleChange] = useForm(
    props.session ? props.session : { name: "" }
  );

  const onSubmit = () => {
    // Check if all is valid
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
        {props.collections.length > 0 && (
          <DropDown
            placeholder="Select Collection..."
            options={props.collections.map((c) => {
              return { value: c._id, label: c.name };
            })}
            defaultValue={(() => {
              let c = props.collections.filter((c) => c._id === collectionId);
              if (c.length === 1) return { value: c[0]._id, label: c[0].name };
              else return null;
            })()}
            onChange={(value: any) => setCollectionId(value.value)}
            isSearchable
          />
        )}
        <TextButton title="Save" loading={loading} />
      </BaseModal>
    </>
  );
};
