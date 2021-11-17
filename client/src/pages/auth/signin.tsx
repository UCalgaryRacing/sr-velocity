// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useForm, useSignIn } from "hooks";
import { InputField } from "components/interface/";

// https://www.html5rocks.com/en/tutorials/forms/constraintvalidation/ - Custom input failure styling

const SignIn: React.FC = () => {
  // Hooks
  const [{ error, fetching, user }, signIn] = useSignIn();
  const [values, handleChange] = useForm({
    email: "",
    password: "",
  });
  const history = useHistory();

  useEffect(() => {
    if (user) history.push("/dashboard");
  }, [user]);

  const onSubmit = async (event: any) => {
    event?.preventDefault();
    signIn(values.email, values.password);
  };

  return (
    <div className="page-content" id="signin" style={{ marginTop: "66px" }}>
      <form onSubmit={onSubmit}>
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
        {fetching && ""}
        {error && ""}
        <button></button>
      </form>
    </div>
  );
};

export default SignIn;
