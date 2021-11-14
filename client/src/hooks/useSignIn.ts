// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { useState } from "react";

// interface SignInProps {
//   email: string;
//   password: string;
// }

interface SignInState {
  error: boolean;
  fetching: boolean;
  user: any;
}

export const useSignIn = () => {
  const [state, setState] = useState<SignInState>({
    error: false,
    fetching: false,
    user: null,
  });

  const signIn = () => {
    // Make request
  };

  return [state.error, state.fetching, state.user, signIn];
};
