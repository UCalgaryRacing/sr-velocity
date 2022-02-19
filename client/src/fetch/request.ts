// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

export const request = (method: string, route: string, body: any = {}) => {
  return new Promise<any>((resolve, reject) => {
    if (!route.startsWith("/")) {
      route = "/" + route;
    }

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
          res = await res.json();
          resolve(res);
        } else {
          reject();
        }
      })
      .catch((_: any) => {
        reject();
      });
  });
};
