// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { ButtonHTMLAttributes } from "react";
import "./_styling/iconButton.css";

// How do we make sure only one of these props is passed?
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  src?: string;
  img?: any; // Check for JSX
}

export const IconButton: React.FC<IconButtonProps> = ({
  src,
  img,
  ...props
}) => {
  return (
    <button className="icon-button" {...props}>
      {src && <img src={src} />}
      {img}
    </button>
  );
};
