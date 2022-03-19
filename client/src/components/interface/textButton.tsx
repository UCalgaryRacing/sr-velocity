// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { ButtonHTMLAttributes } from "react";
import "./_styling/textButton.css";

// How do we make sure only one of these props is passed?
interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: any;
}

export const TextButton: React.FC<TextButtonProps> = ({ title, ...props }) => {
  return (
    <button className="text-button" {...props}>
      <b>{title}</b>
    </button>
  );
};
