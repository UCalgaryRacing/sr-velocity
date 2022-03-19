// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { useState } from "react";

export const useForm = (props: any) => {
  const [values, setValues] = useState(props);

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return [values, handleChange, setValues];
};
