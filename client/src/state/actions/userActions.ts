// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Dispatch } from "redux";
import { User } from "../types";

export enum UserActionType {
  SIGNED_IN = "userSignedIn",
  SIGNED_OUT = "userSignedOut",
  UPDATED = "userUpdated",
}

interface UserSignedInAction {
  type: UserActionType.SIGNED_IN;
  payload: User;
}

interface UserSignedOutAction {
  type: UserActionType.SIGNED_OUT;
}

interface UserUpdatedAction {
  type: UserActionType.UPDATED;
  payload: User;
}

export type UserAction =
  | UserSignedInAction
  | UserSignedOutAction
  | UserUpdatedAction;

export const userSignedIn = (user: User) => {
  return (dispatch: Dispatch<UserSignedInAction>) => {
    dispatch({
      type: UserActionType.SIGNED_IN,
      payload: user,
    });
  };
};

export const userSignedOut = () => {
  return (dispatch: Dispatch<UserSignedOutAction>) => {
    dispatch({
      type: UserActionType.SIGNED_OUT,
    });
  };
};

export const userUpdated = (user: User) => {
  return (dispatch: Dispatch<UserUpdatedAction>) => {
    dispatch({
      type: UserActionType.UPDATED,
      payload: user,
    });
  };
};
