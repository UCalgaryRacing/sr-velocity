// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { InputHTMLAttributes } from "react";
import { Modal, ModalBody, ModalTitle } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import CloseIcon from "@mui/icons-material/Close";
import "./_styling/baseModal.css";

interface ModalProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  show?: boolean;
  children?: any;
  handleChange?: any;
  toggle?: any;
  onSubmit?: any;
}

export const BaseModal: React.FC<ModalProps> = (props: ModalProps) => {
  return (
    <Modal
      show={props.show}
      onHide={props.toggle}
      className="base-modal"
      centered
    >
      <ModalHeader>
        <ModalTitle className="base-modal-title">{props.title}</ModalTitle>
        <div className="base-modal-close" onClick={props.toggle}>
          <CloseIcon />
        </div>
      </ModalHeader>
      <ModalBody className="base-modal-body">
        {props.onSubmit || props.handleChange ? (
          <form autoComplete="off" onSubmit={props.onSubmit}>
            {props.children.map((child: any, i: number) => {
              if (
                React.isValidElement(child) &&
                // @ts-ignore
                child["type"].name == "InputField"
              ) {
                let hc = props.handleChange;
                return React.cloneElement(child, {
                  // @ts-ignore
                  onChange: hc,
                  key: i,
                });
              }
              return child;
            })}
          </form>
        ) : (
          <>
            {props.children.map((child: any, i: number) => {
              return child;
            })}
          </>
        )}
      </ModalBody>
    </Modal>
  );
};
