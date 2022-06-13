// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

let onUnauthorized: any = null;

export const request = (
  method: string,
  route: string,
  body: any = {},
  file = false
) => {
  return new Promise<any>((resolve, reject) => {
    if (!route.startsWith("/")) {
      route = "/" + route;
    }
    route = "/api" + route;

    let fetch_data: RequestInit = {
      method: method,
      credentials: "include",
    };

    if (!file)
      fetch_data.headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

    if (method !== "GET" && !file) {
      fetch_data.body = JSON.stringify(body);
    } else if (file) fetch_data.body = body;

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
          if (res.status === 401 && onUnauthorized) {
            onUnauthorized();
          }
          reject(res);
        }
      })
      .catch((err: any) => reject(err));
  });
};

export const bindOnUnAuthorized = (callback: any) => {
  onUnauthorized = callback;
};
