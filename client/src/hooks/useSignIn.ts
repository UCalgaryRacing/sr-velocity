// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

interface SignInStatus {
  error: any;
  fetching: boolean;
  user: any;
}

type SignInMethod = (email: string, password: string) => void;

export const useSignIn = (): [SignInStatus, SignInMethod] => {
  const [status, setStatus] = useState<SignInStatus>({
    error: null,
    fetching: false,
    user: null,
  });

  const signIn = (email: string, password: string): void => {
    setStatus({ ...status, fetching: true });
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential: UserCredential) => {
        // Now fetch user information
        // Then fetch organization information
        // Add to redux
        setStatus({ ...status, fetching: false, user: userCredential.user });
      })
      .catch((error) => {
        setStatus({ ...status, fetching: false, error: error });
      });
  };

  return [status, signIn];
};
