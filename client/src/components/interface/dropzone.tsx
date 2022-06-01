// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import { useDropzone, DropzoneOptions, Accept } from "react-dropzone";
import "./_styling/dropzone.css";

interface DropZoneProps extends DropzoneOptions {
  file?: File;
}

export const DropZone: React.FC<DropZoneProps> = (props: DropZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...props,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {!props.file && <p>Drag 'n' drop, or click to select files.</p>}
      {props.file && <p>{props.file.name}</p>}
    </div>
  );
};
