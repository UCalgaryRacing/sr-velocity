// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { InputHTMLAttributes } from "react";
import "./_styling/inputField.css";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  referrer?: any;
}

export const InputField: React.FC<InputFieldProps> = ({
  title,
  referrer,
  ...props
}) => {
  return (
    <div className="input-field">
      <input
        className="input-field"
        {...props}
        placeholder={props.placeholder ? props.placeholder : " "}
        ref={referrer}
      />
      {title && !props.placeholder && <label htmlFor={title}>{title}</label>}
    </div>
  );
};
