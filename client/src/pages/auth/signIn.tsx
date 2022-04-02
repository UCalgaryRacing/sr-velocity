// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Jeremy Bilic

import React, { useState } from "react";
import { useHistory } from "react-router";
import { useForm } from "hooks";
import { InputField, TextButton } from "components/interface/";
import { signIn } from "crud";
import { bindActionCreators } from "redux";
import { useAppDispatch, userSignedIn, User } from "state";
import "./_styling/signIn.css";

const SignIn: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const history = useHistory();
  const [values, handleChange] = useForm({
    email: "",
    password: "",
  });
  const setUser = bindActionCreators(userSignedIn, useAppDispatch());

  const timeoutError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

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
      .catch((_: any) => timeoutError());
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
        {showError && (
          <p id="sign-in-error">
            Username or password not recognized, please try again.
          </p>
        )}
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
