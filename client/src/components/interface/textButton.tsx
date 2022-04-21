// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Joey Van Lierop

import React, { ButtonHTMLAttributes } from "react";
import { CircularProgress } from "@mui/material";
import "./_styling/textButton.css";

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  href?: string;
  loading?: boolean;
}

export const TextButton: React.FC<TextButtonProps> = ({
  title,
  href,
  loading,
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
      <b>
        {loading ? (
          <CircularProgress style={{ padding: 4, color: "white" }} />
        ) : (
          title
        )}
      </b>
    </button>
  );
};
