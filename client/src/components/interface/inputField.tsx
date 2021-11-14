// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { InputHTMLAttributes } from "react";

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
    <div id="icon-button">
      {/* Need to add title if prop exists */}
      <input {...props} ref={referrer} />
    </div>
  );
};
