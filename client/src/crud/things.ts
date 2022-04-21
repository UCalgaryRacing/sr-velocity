// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Thing } from "state";
import { request } from ".";

export const getThings = () => {
  return new Promise<Thing[]>((resolve, reject) => {
    request("GET", "/database/thing")
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const postThing = (thing: Thing) => {
  return new Promise<Thing>((resolve, reject) => {
    request("POST", "/database/thing", thing)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putThing = (thing: Thing) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/thing", thing)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const deleteThing = (thingId: string) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/thing/" + thingId)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};
