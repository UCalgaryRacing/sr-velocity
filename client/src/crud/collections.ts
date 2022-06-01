// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { request } from "./request";
import { Collection } from "state";

export const getCollections = (thingId: string) => {
  return new Promise<Collection[]>((resolve, reject) => {
    request("GET", "/database/collections/thing/" + thingId)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const postCollection = (collection: Collection) => {
  return new Promise<void>((resolve, reject) => {
    request("POST", "/database/collections/", collection)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putCollection = (collection: Collection) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/collections/", collection)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};

export const deleteCollection = (collectionId: string) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/collections/" + collectionId)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};
