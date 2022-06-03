// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { ButtonHTMLAttributes } from "react";
import { CircularProgress } from "@mui/material";
import { Remove } from "@mui/icons-material";
import "./_styling/iconButton.css";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  src?: string;
  img?: any; // Check for JSX
  text?: string;
  loading?: boolean;
  striked?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  src,
  img,
  text,
  loading,
  striked,
  ...props
}) => {
  return (
    <button className="icon-button" {...props} disabled={props.disabled}>
      {loading ? (
        <CircularProgress
          className="icon-loading"
          style={{ padding: 8, color: "white" }}
        />
      ) : (
        <>
          {!text && src && <img src={src} alt="" />}
          {striked && (
            <div className="striked">
              <Remove htmlColor="#fff" />
            </div>
          )}
          {!text && img}
          {!img && !src && <div className="text">{text}</div>}
        </>
      )}
    </button>
  );
};
