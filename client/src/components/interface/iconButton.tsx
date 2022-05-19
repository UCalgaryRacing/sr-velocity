// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { ButtonHTMLAttributes } from "react";
import "./_styling/iconButton.css";

// How do we make sure only one of these props is passed?
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  src?: string;
  img?: any; // Check for JSX
  text?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  src,
  img,
  text,
  ...props
}) => {
  return (
    <button className="icon-button" {...props}>
      {!text && src && <img src={src} />}
      {!text && img}
      {!img && !src && <div className="text">{text}</div>}
    </button>
  );
};
