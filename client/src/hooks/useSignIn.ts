// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

interface SignInState {
  error: any;
  fetching: boolean;
  user: any;
}

export const useSignIn = () => {
  const [state, setState] = useState<SignInState>({
    error: null,
    fetching: false,
    user: null,
  });

  const signIn = (email: string, password: string): void => {
    setState({ ...state, fetching: true });
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential: UserCredential) => {
        // Now fetch user information
        // Add to redux
        setState({ ...state, fetching: false, user: userCredential.user });
      })
      .catch((error) => {
        setState({ ...state, fetching: false, error: error });
      });
  };

  return [state.error, state.fetching, state.user, signIn];
};
