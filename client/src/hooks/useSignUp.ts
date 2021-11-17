// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  updateProfile,
} from "firebase/auth";

interface SignUpStatus {
  error: any;
  fetching: boolean;
  success: boolean;
}

type SignUpMethod = (
  displayName: string,
  email: string,
  password: string
) => void;

export const useSignUp = (): [SignUpStatus, SignUpMethod] => {
  const [status, setStatus] = useState<SignUpStatus>({
    error: null,
    fetching: false,
    success: false,
  });

  const signUp = (
    displayName: string,
    email: string,
    password: string
  ): void => {
    setStatus({ ...status, fetching: true });
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential: UserCredential) => {
        updateProfile(userCredential.user, {
          displayName: displayName,
        })
          .then(() => {
            setStatus({ ...status, fetching: false, success: true });
          })
          .catch((reason: any) => {
            // Return error message as string to display
            setStatus({ ...status, fetching: false, error: reason });
          });
      })
      .catch((error) => {
        // Return error message as string to display
        setStatus({ ...status, fetching: false, error: error });
      });
  };

  return [status, signUp];
};
