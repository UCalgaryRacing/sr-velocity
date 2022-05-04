// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { BaseModal } from "components/modals";
import { TextButton, Alert, DropDown } from "components/interface";
import {
  User,
  UserRole,
  isAuthAtLeast,
  useAppSelector,
  RootState,
} from "state";
import { changeUserRole } from "crud";

interface UserModalProps {
  show?: boolean;
  toggle: any;
  user: User;
}

export const UserModal: React.FC<UserModalProps> = (props: UserModalProps) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [role, setRole] = useState<UserRole>(props.user.role);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const onSubmit = () => {
    let updatedUser = { ...props.user, role: role };
    setLoading(true);
    changeUserRole(updatedUser)
      .then((_: any) => {
        setLoading(false);
        props.toggle(updatedUser);
      })
      .catch((_: any) => {
        setLoading(false);
        setShowAlert(true);
      });
  };

  return (
    <>
      <BaseModal
        title="Change User Role"
        show={props.show}
        toggle={props.toggle}
      >
        <DropDown
          placeholder="Role"
          options={(() => {
            let roles = ["Guest", "Member", "Lead"];
            if (isAuthAtLeast(user, UserRole.ADMIN)) roles.push("Admin");
            let options = [];
            for (let role of roles) {
              options.push({ value: role, label: role });
            }
            return options;
          })()}
          onChange={(value: any) => setRole(value.value)}
          defaultValue={(() => {
            return { value: props.user.role, label: props.user.role };
          })()}
        />
        <TextButton title="Save" loading={loading} onClick={onSubmit} />
      </BaseModal>
      <Alert
        title="Something went wrong..."
        description="Please try again..."
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </>
  );
};
