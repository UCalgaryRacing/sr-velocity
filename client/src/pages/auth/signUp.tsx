// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React from "react";
import { useForm, useSignUp } from "hooks";
import { InputField, TextButton, DropDown } from "components/interface/";
import "./_styling/signUp.css";

const SignUp: React.FC = () => {
  const [status, signUp] = useSignUp();
  const [values, handleChange] = useForm({
    displayName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const onSubmit = (event: any) => {
    event?.preventDefault();
  };

  return (
    <div className="page-content" id="sign-up">
      <form id="sign-up-form" onSubmit={onSubmit}>
        <img src="assets/team-logo.svg" />
        <br />
        <br />
        <InputField
          name="displayName"
          type="name"
          placeholder="Display Name"
          value={values.displayName}
          onChange={handleChange}
          required
        />
        <br />
        <DropDown
          options={[{ value: "xxx", label: "Schulich Racing, FSAE" }]}
          placeholder="Select Organization..."
        />
        <br />
        <InputField
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          required
        />
        <br />
        <InputField
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          required
        />
        <br />
        <InputField
          name="passwordConfirm"
          type="password"
          placeholder="Confirm Password"
          value={values.passwordConfirm}
          onChange={handleChange}
          required
        />
        <br />
        <TextButton title="Sign Up" />
        <br />
        <br />
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
