// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect } from "react";
import { signUserOut } from "crud";
import { RootState, useAppSelector, userSignedOut } from "state";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { Alert } from "components/interface";

const AuthWrapper: React.FC = (props) => {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch({ type: "RESET" });
      if (window.location.pathname === "/dashboard") history.push("/sign-in");
    } else {
      // Calculate time remaining based on when the token was issued minus 5 minutes.
      let timeRemaining = 20000000 - 5 * 60 * 1000;
      let interval = setTimeout(requestRenewal, timeRemaining);
      return () => clearTimeout(interval);
    }
  }, [user]);

  const requestRenewal = () => {
    setShowAlert(true);
    // TODO: Show D2L type message saying click anywhere to stay signed in.
    // If user does not respond within like 10 seconds, sign them out.
  };

  const onRenew = () => {
    // Request renewal of token
    // On success, restart the timer
    setShowAlert(false);
  };

  return (
    <>
      {props.children}
      <Alert
        title="Still There?"
        description="Click anywhere to stay signed in."
        color="#ba1833"
        onDismiss={onRenew}
        show={showAlert}
      />
    </>
  );
};

export default AuthWrapper;
