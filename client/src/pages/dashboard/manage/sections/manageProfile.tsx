// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { RootState, useAppSelector, userSignedIn, useAppDispatch } from "state";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { InputField, TextButton, Alert } from "components/interface/";
import { signUserOut, putUser } from "crud";
import { useForm } from "hooks";

export const ManageProfile: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.user);
  const setUser = bindActionCreators(userSignedIn, useAppDispatch());
  const dispatch = useDispatch();

  const [values, handleChange] = useForm({ ...user });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertColor, setAlertColor] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [signOutLoading, setSignOutLoading] = useState<boolean>(false);

  const alert = (error: boolean, description: string) => {
    if (error) setAlertTitle("Something went wrong...");
    else setAlertTitle("Success!");
    setAlertColor(error ? "red" : "green");
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (event: any) => {
    event?.preventDefault();
    setUpdateLoading(true);
    putUser(values)
      .then((_: any) => {
        setUser(values);
        alert(false, "Your profile was updated!");
        setUpdateLoading(false);
      })
      .catch((err: any) => {
        if (err.status === 409)
          alert(
            true,
            "Your email must be globally unique, and your username must be unique to the organization."
          );
        else alert(true, "Please try again...");
        setUpdateLoading(false);
      });
  };

  const signOut = () => {
    setSignOutLoading(true);
    signUserOut()
      .then((_: any) => {
        setSignOutLoading(false);
        dispatch({ type: "RESET" });
        window.location.href = "/";
      })
      .catch((_: any) => {
        alert(true, "Please try again...");
        setSignOutLoading(false);
      });
  };

  return (
    <div id="centered">
      <div id="centered-content">
        <form id="sign-in-form" onSubmit={onSubmit}>
          <img src="assets/team-logo.svg" />
          <InputField
            name="name"
            type="name"
            title="Display Name"
            value={values.name}
            onChange={handleChange}
            required
          />
          <InputField
            name="email"
            type="email"
            title="Email"
            value={values.email}
            onChange={handleChange}
            required
          />
          <TextButton title="Update" loading={updateLoading} />
          {/* <TextButton type="button" title="Change Password" /> TODO */}
          <TextButton
            type="button"
            title="Sign Out"
            onClick={signOut}
            loading={signOutLoading}
          />
        </form>
      </div>
      <Alert
        title={alertTitle}
        description={alertDescription}
        color={alertColor}
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </div>
  );
};
