// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React, { useEffect, useRef } from "react";
import { useForm, useSignIn } from "hooks";
import { InputField } from "components/interface/";

const SignIn: React.FC = () => {
  const [{ error, fetching, user }, signIn] = useSignIn();
  const [values, bindInput, handleChange, submit] = useForm({
    initValues: {
      email: "",
      password: "",
    },
    submitOnEnter: false, // TODO: Find way to add qualifier
  });

  const onSubmit = async (result: any) => {
    if (!("error" in result)) {
      // const { error, user } = await signIn(values);
      // if (error) {
      // } else {
      // }
    }
  };

  return (
    <div id="signin" style={{ marginTop: "66px" }}>
      <form>
        <InputField
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onKeyPress={(e: any) => submit(e, onSubmit)}
          onChange={handleChange}
          referrer={bindInput}
        />
        <br />
        <InputField
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onKeyPress={(e: any) => submit(e, onSubmit)}
          onChange={handleChange}
          referrer={bindInput}
        />
      </form>
    </div>
  );
};

export default SignIn;
