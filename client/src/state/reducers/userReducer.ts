// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { UserAction, UserActionType } from "../actions";
import { User } from "../types";

const userReducer = (
  state: User | null = null,
  action: UserAction
): User | null => {
  switch (action.type) {
    case UserActionType.SIGNED_IN:
    case UserActionType.UPDATED: {
      let user: User = action.payload;
      return { ...state, ...user };
    }
    case UserActionType.SIGNED_OUT: {
      return null;
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
