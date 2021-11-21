// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, reducers } from "./reducers";

const loadSessionState = () => {
  try {
    const serialized = sessionStorage.getItem("state");
    if (serialized === null) return {};
    return JSON.parse(serialized);
  } catch {
    return {};
  }
};

const cacheState = (state: RootState) => {
  try {
    const serialized = JSON.stringify(state);
    sessionStorage.setItem("state", serialized);
  } catch {}
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadSessionState(),
});

store.subscribe(() => {
  cacheState(store.getState());
});

export type RootState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;
