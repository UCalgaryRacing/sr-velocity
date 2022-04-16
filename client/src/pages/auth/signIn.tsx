// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Jeremy Bilic

import React, { useState } from "react";
import { useHistory } from "react-router";
import { useForm } from "hooks";
import { InputField, TextButton, Alert } from "components/interface/";
import { signIn } from "crud";
import { bindActionCreators } from "redux";
import { useAppDispatch, userSignedIn, User } from "state";
import "./_styling/signIn.css";

const SignIn: React.FC = () => {
  const [showError, setShowError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const history = useHistory();
  const [values, handleChange] = useForm({
    email: "",
    password: "",
  });
  const setUser = bindActionCreators(userSignedIn, useAppDispatch());

  const onSubmit = (event: any) => {
    event?.preventDefault();
    signIn({
      email: values.email,
      password: values.password,
    })
      .then((user: User) => {
        setUser(user);
        history.push("/dashboard");
      })
      .catch((err: any) => {
        if (err.status === 500)
          setError("Username or password not recognized, please try again.");
        else setError("Your account has not been approved yet.");
        setShowError(true);
      });
  };

  return (
    <div className="page-content" id="sign-in">
      <form id="sign-in-form" onSubmit={onSubmit}>
        <img src="assets/team-logo.svg" />
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
        <TextButton title="Sign In" />
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
      <Alert
        title="Something went wrong..."
        description={error}
        color="red"
        onDismiss={() => setShowError(false)}
        show={showError}
        slideOut
      />
    </div>
  );
};

export default SignIn;
