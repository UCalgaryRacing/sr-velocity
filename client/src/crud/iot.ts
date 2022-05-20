// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { request } from ".";

export const requestMissingData = (thingId: string) => {
  return new Promise<any[]>((resolve, reject) => {
    request("GET", "/iot/real-time/" + thingId + "/data")
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const sendMessage = (thingId: string, message: string) => {
  return new Promise<void>((resolve, reject) => {
    request("POST", "/iot/real-time/" + thingId + "/message", { message })
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};
