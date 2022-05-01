// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { IconButton, Alert } from "components/interface";
import { CloseOutlined, Edit } from "@mui/icons-material";
import { OperatorModal } from "../modals/operatorModal";
import { ConfirmModal } from "components/modals";
import { deleteOperator } from "crud";
import {
  useAppSelector,
  RootState,
  UserRole,
  isAuthAtLeast,
  Operator,
  Thing,
} from "state";

interface OperatorCardProps {
  operator: Operator;
  things: Thing[];
  onOperatorUpdate?: (operator: Operator) => void;
  onOperatorDelete?: (operatorId: string) => void;
}

export const OperatorCard: React.FC<OperatorCardProps> = (
  props: OperatorCardProps
) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showOperatorModal, setShowOperatorModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const onDelete = () => {
    setLoading(true);
    deleteOperator(props.operator._id)
      .then((_: any) => {
        if (props.onOperatorDelete) props.onOperatorDelete(props.operator._id);
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
        <b>{props.operator.name}</b>
      </div>
      {props.things.length > 0 && (
        <div>
          <b>Associated Thing(s):</b>
          {(() => {
            let thingsString = " ";
            let associatedThings = props.things.filter((thing) =>
              props.operator.thingIds.includes(thing._id)
            );
            console.log(props.things);
            console.log(props.operator);
            for (const thing of associatedThings)
              thingsString += thing.name + ", ";
            thingsString = thingsString.substring(0, thingsString.length - 2);
            return thingsString;
          })()}
        </div>
      )}
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
            onClick={() => setShowOperatorModal(true)}
          />
        </>
      )}
      <ConfirmModal
        title={
          "Are you sure you want to delete Operator '" +
          props.operator.name +
          "'?"
        }
        show={showConfirmationModal}
        toggle={() => setShowConfirmationModal(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <OperatorModal
        show={showOperatorModal}
        toggle={(operator: Operator) => {
          if (props.onOperatorUpdate) props.onOperatorUpdate(operator);
          setShowOperatorModal(false);
        }}
        operator={props.operator}
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
