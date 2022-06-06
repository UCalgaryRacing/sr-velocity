// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import {
  InputField,
  MultiSelect,
  TextButton,
  Alert,
  TextArea,
} from "components/interface";
import { BaseModal } from "components/modals";
import { Session, Collection, Thing } from "state";
import { postCollection, putCollection } from "crud";
import { useForm } from "hooks";

interface CollectionModalProps {
  show?: boolean;
  toggle: any;
  thing: Thing;
  collection?: Collection;
  sessions: Session[];
}

export const CollectionModal: React.FC<CollectionModalProps> = (
  props: CollectionModalProps
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [description, setDescription] = useState<string>();
  const [sessions, setSessions] = useState<Session[]>(
    props.collection
      ? props.sessions.filter((s) =>
          props.collection?.sessionIds.includes(s._id)
        )
      : []
  );
  const [values, handleChange] = useForm(
    props.collection ? { ...props.collection } : { name: "", sessionIds: [] }
  );

  useEffect(() => {
    if (!props.collection) return;
    setDescription(props.collection.description);
  }, [props.collection]);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (props.collection) {
      let collection = {
        ...values,
        thingId: props.thing._id,
        description: description ? description : "",
      };
      putCollection(collection)
        .then(() => {
          setLoading(false);
          props.toggle(collection);
        })
        .catch((_: any) => {
          setLoading(false);
          // TODO: Check if status conflict
          alert("Could not update collection, please try again.");
        });
    } else {
      let collection = {
        ...values,
        thingId: props.thing._id,
        description: description ? description : "",
      };
      postCollection(collection)
        .then((collection: Collection) => {
          setLoading(false);
          props.toggle(collection);
        })
        .catch((_: any) => {
          setLoading(false);
          // TODO: Check if status conflict
          alert("Could not create Collection, please try again.");
        });
    }
  };

  const onSessionChange = (selectedList: any[], _: any[]) => {
    let sessions = [];
    for (let s of selectedList) sessions.push(s.value);
    setSessions(sessions);
    values.sessionIds = sessions.map((s) => s._id);
  };

  return (
    <>
      <BaseModal
        title={props.collection ? "Edit Collection" : "New Collection"}
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
          minLength={4}
          maxLength={30}
          required
        />
        <TextArea
          value={description}
          onUpdate={setDescription}
          holder="Description..."
        />
        {props.sessions.length > 0 && (
          <MultiSelect
            placeholder="Sessions"
            options={props.sessions.map((s) => {
              return { key: s.name, value: s };
            })}
            selectedValues={sessions.map((s) => {
              return { key: s.name, value: s };
            })}
            onSelect={onSessionChange}
            onRemove={onSessionChange}
            isSearchable
          />
        )}
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
