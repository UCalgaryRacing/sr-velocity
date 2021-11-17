// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React, { useEffect, useRef } from "react";
import { useForm, useSignIn } from "hooks";
import { InputField } from "components/interface/";

// https://www.html5rocks.com/en/tutorials/forms/constraintvalidation/ - Custom input failure styling

const SignIn: React.FC = () => {
  const [{ error, fetching, user }, signIn] = useSignIn();
  const [values, handleChange] = useForm({
    initValues: {
      email: "",
      password: "",
    },
    submitOnEnter: false,
  });

  const onSubmit = async (event: any) => {
    event?.preventDefault();
    console.log("here");
  };

  return (
    <div id="signin" style={{ marginTop: "66px" }}>
      <form onSubmit={onSubmit}>
        <InputField
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          required
          //referrer={bindInput}
        />
        <br />
        <InputField
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          required
          //referrer={bindInput}
        />
        <button></button>
      </form>
    </div>
  );
};

export default SignIn;
