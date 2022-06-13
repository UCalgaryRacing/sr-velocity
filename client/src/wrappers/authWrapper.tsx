// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect } from "react";
import { signUserOut, renewUser, bindOnUnAuthorized } from "crud";
import {
  RootState,
  useAppSelector,
  useAppDispatch,
  userSignedIn,
  User,
} from "state";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert } from "components/interface";
import { bindActionCreators } from "redux";

let renewTimeout: any = null;
const timeToRenew = 5 * 60; // 5 minutes

const AuthWrapper: React.FC = (props) => {
  const user = useAppSelector((state: RootState) => state.user);
  const setUser = bindActionCreators(userSignedIn, useAppDispatch());
  const dispatch = useDispatch();
  const history = useHistory();
  const [alertTime, setAlertTime] = useState<number>(
    user
      ? user?.expirationTime - Date.now() - 5 * 60 * 1000
      : Math.pow(10, 1000)
  );
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    bindOnUnAuthorized(kick);
  }, []);

  useEffect(() => {
    if (!user) {
      dispatch({ type: "RESET" });
      if (window.location.pathname === "/dashboard") history.push("/sign-in");
    } else {
      setAlertTime(user?.expirationTime - Date.now() - 5 * 60 * 1000);
      return () => {
        if (renewTimeout != null) clearTimeout(renewTimeout);
      };
    }
  }, [user]);

  useEffect(() => {
    if (renewTimeout != null) clearTimeout(renewTimeout);
    renewTimeout = setTimeout(() => setShowAlert(true), alertTime);
  }, [alertTime]);

  const kick = () => {
    dispatch({ type: "RESET" });
    history.push("/sign-in");
  };

  const renewalTimeout = () => {
    setShowAlert(false);
    clearTimeout(renewTimeout);
    signUserOut().then((_: any) => kick());
  };

  const onRenew = () => {
    setShowAlert(false);
    renewUser()
      .then((user: User) => setUser(user))
      .catch((_: any) => renewalTimeout());
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
        duration={timeToRenew}
        onTimeout={renewalTimeout}
      />
    </>
  );
};

export default AuthWrapper;
