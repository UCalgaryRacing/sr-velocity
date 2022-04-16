// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { GATEWAYSERVERIP } from "stream/dataServerEnv";

export const request = (method: string, route: string, body: any = {}) => {
  return new Promise<any>((resolve, reject) => {
    if (!route.startsWith("/")) {
      route = "/" + route;
    }
    route = GATEWAYSERVERIP + "/api" + route;

    let fetch_data: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json", // TODO: Support other types
        Accept: "application/json",
      },
      credentials: "include",
    };

    if (method !== "GET") {
      fetch_data.body = JSON.stringify(body);
    }

    fetch(route, fetch_data)
      .then(async (res) => {
        if (res.status === 200) {
          try {
            res = await res.json();
            resolve(res);
          } catch (err) {
            resolve({});
          }
        } else {
          reject(res);
        }
      })
      .catch((err: any) => reject(err));
  });
};
