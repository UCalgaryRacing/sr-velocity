// Copyright Schulich Racing FSAE
// Written by Joey Van Lierop

import { CircularProgress } from "@mui/material";
import React, { ButtonHTMLAttributes } from "react";
import "./_styling/textButton.css";

// How do we make sure only one of these props is passed?
interface TextSpinnerButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  loading?: boolean;
}

export const TextSpinnerButton: React.FC<TextSpinnerButtonProps> = ({
  title,
  loading,
  ...props
}) => {
  return (
    <button className="text-button" {...props}>
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
