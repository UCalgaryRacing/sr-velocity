// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React from "react";
import { useForm } from "hooks";
import { InputField } from "components/interface/";

const SignUp: React.FC = () => {
  const [values, bindInput, handleChange, submit] = useForm({
    initValues: {
      email: "",
      password: "",
    },
    submitOnEnter: false, // TODO: Find way to add qualifier
  });
  return (
    <div id="signup">
      <form></form>
    </div>
  );
};

export default SignUp;
