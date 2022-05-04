// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import {
  User,
  useAppSelector,
  RootState,
  isAuthAtLeast,
  UserRole,
} from "state";
import { ConfirmModal } from "components/modals";
import { UserModal } from "../modals/userModal";
import { IconButton, Alert } from "components/interface";
import { CloseOutlined, Edit } from "@mui/icons-material";
import { deleteUser } from "crud";

interface UserCardProps {
  user: User;
  onUserDelete: (userId: string) => void;
  onUserRoleChange: (user: User) => void;
  onlyAdmin: boolean;
}

export const UserCard: React.FC<UserCardProps> = (props: UserCardProps) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const onDelete = () => {
    setLoading(true);
    deleteUser(props.user._id)
      .then((_: any) => {
        if (props.onUserDelete) props.onUserDelete(props.user._id);
        setLoading(false);
      })
      .catch((_: any) => {
        setLoading(false);
        setShowAlert(true);
      });
  };

  return (
    <div
      className="card"
      style={{ color: props.user.role === "Pending" ? "#777777" : "#171717" }}
    >
      <div className="card-title">
        <b>
          {props.user.name +
            " " +
            (props.user.role === "Pending" ? " - PENDING" : "")}
        </b>
      </div>
      <div>
        <b>Email:</b>&nbsp;{props.user.email}
      </div>
      <div>
        <b>Role:</b>&nbsp;{props.user.role}
      </div>
      {isAuthAtLeast(user, UserRole.ADMIN) &&
        !props.onlyAdmin &&
        user?._id !== props.user._id && (
          <>
            <IconButton
              id="card-delete"
              img={<CloseOutlined />}
              onClick={() => setShowConfirmationModal(true)}
            />
          </>
        )}
      {isAuthAtLeast(user, UserRole.LEAD) &&
        !props.onlyAdmin &&
        user?._id !== props.user._id && (
          <>
            <IconButton
              id="card-edit"
              style={{
                top: user?.role === "Lead" || props.onlyAdmin ? "5px" : "45px",
              }}
              img={<Edit />}
              onClick={() => setShowUserModal(true)}
            />
          </>
        )}
      <ConfirmModal
        title={
          "Are you sure you want to delete User '" + props.user.name + "'?"
        }
        show={showConfirmationModal}
        toggle={() => setShowConfirmationModal(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <UserModal
        show={showUserModal}
        toggle={(user: User) => {
          props.onUserRoleChange(user);
          setShowUserModal(false);
        }}
        user={props.user}
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
