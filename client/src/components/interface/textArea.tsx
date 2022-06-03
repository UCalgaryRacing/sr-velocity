// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./_styling/textArea.css";

interface TextAreaProps {
  value: any;
  holder?: string;
  onUpdate: any;
}

export const TextArea: React.FC<TextAreaProps> = (props: TextAreaProps) => {
  return (
    <div className="text-area">
      <ReactQuill
        value={props.value || ""}
        placeholder={props.holder}
        onChange={props.onUpdate}
      />
    </div>
  );
};
