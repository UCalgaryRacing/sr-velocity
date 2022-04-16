// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { ButtonHTMLAttributes } from "react";
import "./_styling/textButton.css";

// How do we make sure only one of these props is passed?
interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  href?: string;
}

export const TextButton: React.FC<TextButtonProps> = ({
  title,
  href,
  ...props
}) => {
  return (
    <button
      className="text-button"
      {...props}
      onClick={(e: any) => {
        if (props.onClick) props.onClick(e);
        if (href) window.location.href = "/";
      }}
    >
      <b>{title}</b>
    </button>
  );
};
