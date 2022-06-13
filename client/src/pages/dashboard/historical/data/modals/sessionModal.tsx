// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import {
  InputField,
  DropDown,
  MultiSelect,
  TextButton,
  Alert,
  DropZone,
  DateTime,
} from "components/interface";
import { BaseModal } from "components/modals";
import { Session, Collection, Operator, Thing } from "state";
import {
  postSession,
  putSession,
  uploadSessionFile,
  deleteSession,
} from "crud";
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
  const [file, setFile] = useState<File>();
  const [, setOperatorId] = useState<string>("");
  const [collections, setCollections] = useState<Collection[]>(
    props.session
      ? props.collections.filter((c) =>
          props.session?.collectionIds.includes(c._id)
        )
      : []
  );
  const [values, handleChange] = useForm(
    props.session
      ? { ...props.session }
      : { name: "", collectionIds: [], operatorId: null }
  );

  useEffect(() => {
    if (!props.session) return;
    setStartTime(new Date(props.session.startTime));
    props.session.endTime && setEndTime(new Date(props.session.endTime));
  }, [props.session]);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onFileDrop = (acceptedFiles: any[]) => {
    if (acceptedFiles[0].name.endsWith(".log")) {
      // TODO: Parse log files!
    } else {
      setFile(acceptedFiles[0]);
    }
  };

  const inProgress = () => {
    if (!props.session) return false;
    if (props.session.endTime) return false;
    else return true;
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!inProgress()) {
      if (!startTime || !endTime) {
        alert("The session must have a start and end time.");
        return;
      }

      if (startTime.getTime() > endTime.getTime()) {
        alert("The end time must be after the start time.");
        return;
      }
    }

    setLoading(true);
    if (props.session) {
      let session = {
        ...values,
        startTime: startTime!.getTime(),
        endTime: !inProgress() ? endTime!.getTime() : null,
      };
      putSession(session)
        .then(() => {
          setLoading(false);
          props.toggle(session);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409) alert("The Session name must be unique.");
          else alert("Could not create Session, please try again.");
        });
    } else {
      if (!file) {
        alert("A file must be selected to create a session.");
        return;
      }
      let newSession = {
        ...values,
        startTime: startTime!.getTime(),
        endTime: !inProgress() ? endTime!.getTime() : null,
        thingId: props.thing._id,
      };
      postSession(newSession)
        .then((session: Session) => {
          let formData = new FormData();
          formData.append("file", file);
          uploadSessionFile(session._id, formData)
            .then((_: any) => {
              setLoading(false);
              props.toggle(session);
            })
            .catch((_: any) => {
              setLoading(false);
              alert("Failed to upload file.");
              deleteSession(session._id);
            });
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409) alert("The Session name must be unique.");
          else alert("Could not create Session, please try again.");
        });
    }
  };

  const onCollectionChange = (selectedList: any[], _: any[]) => {
    let collections = [];
    for (let c of selectedList) collections.push(c.value);
    setCollections(collections);
    values.collectionIds = collections.map((c) => c._id);
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
          onChange={handleChange}
          minLength={2}
          maxLength={30}
          required
        />
        {!inProgress() && (
          <>
            <DateTime value={startTime} onChange={setStartTime} />
            <DateTime value={endTime} onChange={setEndTime} />
          </>
        )}
        {props.collections.length > 0 && (
          <MultiSelect
            placeholder="Collections"
            options={props.collections.map((c) => {
              return { key: c.name, value: c };
            })}
            selectedValues={collections.map((c) => {
              return { key: c.name, value: c };
            })}
            onSelect={onCollectionChange}
            onRemove={onCollectionChange}
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
        {!props.session && (
          <DropZone maxFiles={1} onDrop={onFileDrop} file={file} />
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
