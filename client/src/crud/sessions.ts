// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { request } from "./request";
import { Session } from "state";

export const getSessions = (thingId: string) => {
  return new Promise<Session[]>((resolve, reject) => {
    request("GET", "/database/sessions/thing/" + thingId)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const postSession = (session: Session) => {
  return new Promise<Session>((resolve, reject) => {
    request("POST", "/database/sessions/", session)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putSession = (session: Session) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/sessions/", session)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};

export const deleteSession = (sessionId: string) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/sessions/" + sessionId)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};

export const downloadSessionFile = (sessionId: string) => {
  return new Promise<any>((resolve, reject) => {
    request("GET", "/database/sessions/" + sessionId + "/file")
      .then((blob: any) => resolve(blob))
      .catch((err: any) => reject(err));
  });
};
