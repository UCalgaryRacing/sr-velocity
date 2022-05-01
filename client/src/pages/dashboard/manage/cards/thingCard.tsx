// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { IconButton, Alert } from "components/interface";
import { CloseOutlined, Edit } from "@mui/icons-material";
import { ThingModal } from "../modals/thingModal";
import { ConfirmModal } from "components/modals";
import { deleteThing } from "crud";
import {
  useAppSelector,
  RootState,
  UserRole,
  isAuthAtLeast,
  Thing,
} from "state";

interface ThingCardProps {
  thing: Thing;
  onThingUpdate?: (thing: Thing) => void;
  onThingDelete?: (thingId: string) => void;
}

// TODO: Show associated operators
export const ThingCard: React.FC<ThingCardProps> = (props: ThingCardProps) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showThingModal, setShowThingModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const onDelete = () => {
    setLoading(true);
    deleteThing(props.thing._id)
      .then((_: any) => {
        if (props.onThingDelete) props.onThingDelete(props.thing._id);
        setLoading(false);
        setShowConfirmationModal(false);
      })
      .catch((_: any) => {
        setLoading(false);
        setShowAlert(true);
      });
  };

  return (
    <div className="card">
      <div className="card-title">
        <b>{props.thing.name}</b>
      </div>
      <div className="thing-id">SN:&nbsp;{props.thing._id}</div>
      {isAuthAtLeast(user, UserRole.ADMIN) && (
        <>
          <IconButton
            id="card-delete"
            img={<CloseOutlined />}
            onClick={() => setShowConfirmationModal(true)}
          />
          <IconButton
            id="card-edit"
            img={<Edit />}
            onClick={() => setShowThingModal(true)}
          />
        </>
      )}
      <ConfirmModal
        show={showConfirmationModal}
        toggle={() => setShowConfirmationModal(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <ThingModal
        show={showThingModal}
        toggle={(thing: Thing) => {
          if (props.onThingUpdate) props.onThingUpdate(thing);
          setShowThingModal(false);
        }}
        thing={props.thing}
      />
      <Alert
        title="Something went wrong..."
        description="Please try again..."
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </div>
  );
};
