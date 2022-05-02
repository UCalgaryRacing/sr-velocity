// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import Multiselect from "multiselect-react-dropdown";
import "./_styling/multiSelect.css";

export const MultiSelect: React.FC<any> = (props: any) => {
  return (
    <Multiselect {...props} displayValue="key" avoidHighlightFirstOption />
  );
};
