// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React, { useState } from "react";
import { RootState, useAppSelector } from "state";
import { useForm } from "hooks";
import { InputField, TextButton } from "components/interface/";
import { signUserOut } from "crud";
import "./_styling/profile.css";

// TODO: Add change password functionality
// TODO: Show some organization information

const Profile: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.user);
  const [values, handleChange] = useForm({ ...user });
  const [showError, setShowError] = useState(false);

  const onSubmit = (event: any) => {
    event?.preventDefault();
    // Call function to update the user.
  };

  const signOut = () => {
    signUserOut()
      .then((_: any) => {
        // Success
        // Send to the home page
      })
      .catch((_: any) => {
        // Failure
      });
  };

  return (
    <div className="page-content" id="profile">
      <div id="profile-content">
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
          <TextButton title="Update" />
          <TextButton type="button" title="Change Password" />
          <TextButton type="button" title="Sign Out" onClick={signOut} />
        </form>
      </div>
    </div>
  );
};

export default Profile;
