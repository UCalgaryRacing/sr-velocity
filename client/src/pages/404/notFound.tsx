// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { TextButton } from "components/interface";
import "./notFound.css";

const NotFound: React.FC = () => {
  return (
    <div id="not-found" className="page-content">
      <img src="assets/team-logo.svg" />
      <div id="title">
        <b>404</b>
      </div>
      <TextButton title="Home" onClick={() => (window.location.href = "/")} />
    </div>
  );
};

export default NotFound;
