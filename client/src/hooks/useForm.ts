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

  return [
    values,
    (ref: any) => {
      if (!ref) return;
      let newRefs = [...refs];
      const existing = newRefs.filter((existing) => ref.name === existing.name);
      if (existing.length === 0) {
        newRefs.push(ref);
        setRefs(newRefs);
      }
      return ref;
    },
    (e: any) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
    (e: any, success: any) => {
      if (e.key !== "Enter") return;
      for (let ref of refs) {
        if (ref.value === "") {
          ref.focus();
          return;
        }
      }
      if (props.submitOnEnter) success({});
    },
  ];
};
