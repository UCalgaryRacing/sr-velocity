// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

// Need to use timeouts that are initially null so no typescript for this file
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { signUserOut, renewUser } from "crud";
import { RootState, useAppSelector, userSignedOut } from "state";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert } from "components/interface";

let credentialTimeout = null

const AuthWrapper: React.FC = (props) => {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false);
  
  // Calculate time remaining based on when the token was issued minus 5 minutes.
  let credentialTimeMS = 20000000 - 5 * 60 * 1000;
  let alert_time_s = 10; // 10 seconds


  useEffect(() => {
    
    if (!user) {
      dispatch({ type: "RESET" });
      if (window.location.pathname === "/dashboard") history.push("/sign-in");
    } else {

      if (credentialTimeout != null) {
        clearTimeout(credentialTimeout);
      }
      
      credentialTimeout = setTimeout(requestRenewal, credentialTimeMS);
      return () => {
        if (credentialTimeout != null) {
          clearTimeout(credentialTimeout);
        }
      };
    }
  }, [user]);

  const renewalTimeout = () => {
    setShowAlert(false);
    clearTimeout(credentialTimeout)
    signUserOut()
    .then((_: any) => {
      dispatch({ type: "RESET" });
      history.push("/sign-in")
    })
  }

  const requestRenewal = () => {
    setShowAlert(true);
  };

  const onRenew = () => {
    setShowAlert(false);

    renewUser()
    .then((_:any) => {
      clearTimeout(credentialTimeout);
      credentialTimeout = setTimeout(requestRenewal, credentialTimeMS);
    })
    .catch((_:any) => {
      alert("Error renewing user session... Please log in again")
      renewalTimeout()
    })
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
        duration={alert_time_s}
        onTimeout={renewalTimeout}
      />
    </>
  );
};

export default AuthWrapper;
