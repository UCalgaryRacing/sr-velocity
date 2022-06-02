// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { ButtonHTMLAttributes } from "react";
import { CircularProgress } from "@mui/material";
import "./_styling/iconButton.css";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  src?: string;
  img?: any; // Check for JSX
  text?: string;
  loading?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  src,
  img,
  text,
  loading,
  ...props
}) => {
  return (
    <button className="icon-button" {...props}>
      {loading ? (
        <CircularProgress
          className="icon-loading"
          style={{ padding: 8, color: "white" }}
        />
      ) : (
        <>
          {!text && src && <img src={src} alt="" />}
          {!text && img}
          {!img && !src && <div className="text">{text}</div>}
        </>
      )}
    </button>
  );
};
