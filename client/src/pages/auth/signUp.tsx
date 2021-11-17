// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React from "react";
import { useForm, useSignUp } from "hooks";
import { InputField } from "components/interface/";

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
    <div className="page-content" id="signup">
      <form onSubmit={onSubmit}>
        <InputField
          name="displayName"
          type="name"
          placeholder="Display Name"
          value={values.email}
          onChange={handleChange}
          required
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
      </form>
    </div>
  );
};

export default SignUp;
