// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Jeremy Bilic

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useForm } from "hooks";
import { InputField, TextButton } from "components/interface/";
import "./_styling/signIn.css";
import { signIn } from "crud";
import { bindActionCreators } from "redux";
import { useAppDispatch, userSignedIn } from "state";

const SignIn: React.FC = () => {
  const [failedLogin, setFailedLoginToggle] = useState(false);
  const history = useHistory();
  const [values, handleChange] = useForm({
    email: "",
    password: "",
  });
  const setUser = bindActionCreators(userSignedIn, useAppDispatch());

  const onSubmit = (event: any) => {
    event?.preventDefault();
    signIn(
      {
        email: values.email,
        password: values.password,
      },
      setUser
    )
      .then((res: any) => {
        history.push("/dashboard");
      })
      .catch((err: any) => {
        setFailedLoginToggle(true);
      });
  };

  return (
    <div className="page-content" id="sign-in">
      <form id="sign-in-form" onSubmit={onSubmit}>
        <img src="assets/team-logo.svg" />
        <br />
        <br />
        {failedLogin && (
          <p style={{ color: "red" }}>Username or password not recognized...</p>
        )}
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
