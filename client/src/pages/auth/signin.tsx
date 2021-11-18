// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useForm, useSignIn } from "hooks";
import { InputField, TextButton } from "components/interface/";
import "./_styling/signIn.css";

const SignIn: React.FC = () => {
  // Hooks
  const history = useHistory();
  const [status, signIn] = useSignIn();
  const [values, handleChange] = useForm({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (status.user) history.push("/dashboard");
  }, [status]);

  const onSubmit = (event: any) => {
    event?.preventDefault();
    signIn(values.email, values.password);
  };

  return (
    <div className="page-content" id="sign-in" style={{ marginTop: "66px" }}>
      <form id="sign-in-form" onSubmit={onSubmit}>
        <img src="assets/team-logo.svg" />
        {status.fetching && ""}
        {status.error && ""}
        <br />
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
        <TextButton title="Sign In" />
        <br />
        <br />
        <div id="redirect">
          <b>
            Don't have an account?&nbsp;<a href="/sign-up">Sign Up</a>
          </b>
          <br />
          <b>
            <a href="/forgot-password">Forgot Password?</a>
          </b>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
