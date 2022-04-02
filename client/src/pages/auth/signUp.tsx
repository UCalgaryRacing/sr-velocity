// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React, { useState, useEffect } from "react";
import { useForm } from "hooks";
import { InputField, TextButton, DropDown } from "components/interface/";
import "./_styling/signUp.css";

const SignUp: React.FC = () => {
  const [organization, setOrganization] = useState("");
  const [values, handleChange] = useForm({
    displayName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const onSubmit = (event: any) => {
    event?.preventDefault();
    if (organization === "") {
      // Show error, need an organization
    } else {
      // signUp(values.displayName, values.email, values.password);
    }
  };

  return (
    <div className="page-content" id="sign-up">
      <form id="sign-up-form" onSubmit={onSubmit}>
        <img src="assets/team-logo.svg" />
        <InputField
          name="displayName"
          type="name"
          title="Display Name"
          value={values.displayName}
          onChange={handleChange}
          required
        />
        <DropDown
          options={[{ value: "xxx", label: "Schulich Racing, FSAE" }]}
          placeholder="Select Organization..."
          // Need event to store
        />
        <InputField
          name="email"
          type="email"
          title="Email"
          value={values.email}
          onChange={handleChange}
          required
        />
        <InputField
          name="password"
          type="password"
          title="Password"
          value={values.password}
          onChange={handleChange}
          required
        />
        <InputField
          name="passwordConfirm"
          type="password"
          title="Password Confirmation"
          value={values.passwordConfirm}
          onChange={handleChange}
          required
        />
        <TextButton title="Sign Up" />
        <div id="redirect">
          <b>
            Already have an account?&nbsp;<a href="/sign-in">Sign In</a>
          </b>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
