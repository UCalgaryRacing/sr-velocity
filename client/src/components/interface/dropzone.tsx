// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import "./_styling/dropzone.css";

interface DropZoneProps extends DropzoneOptions {}

export const DropZone: React.FC<DropZoneProps> = (props: DropZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...props,
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop, or click to select files.</p>
      )}
    </div>
  );
};
