// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { useState } from "react";

interface UseFormProps {
  initValues: any;
  submitOnEnter?: false;
}

export const useForm = (props: UseFormProps) => {
  const [values, setValues] = useState(props.initValues);
  const [refs, setRefs] = useState<any>([]);

  const handleChange = (event: any) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return [values, handleChange];
};
