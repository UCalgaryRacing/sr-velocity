// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import { BaseModal } from "./";
import { TextButton } from "components/interface";

interface ConfirmModalProps {
  show?: boolean;
  toggle: any;
  onConfirm: any;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = (
  props: ConfirmModalProps
) => {
  return (
    <BaseModal title="Are you sure?" show={props.show} toggle={props.toggle}>
      <TextButton
        title="Confirm"
        onClick={props.onConfirm}
        loading={props.loading}
      />
      <TextButton title="Cancel" onClick={props.toggle} />
    </BaseModal>
  );
};
