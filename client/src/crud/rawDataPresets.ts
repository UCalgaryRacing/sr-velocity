// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { RawDataPreset } from "state";
import { request } from ".";

export const getRawDataPresets = (thingId: string) => {
  return new Promise<RawDataPreset[]>((resolve, reject) => {
    request("GET", "/database/rawDataPreset/thing/" + thingId)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const postRawDataPreset = (rawDataPreset: RawDataPreset) => {
  return new Promise<RawDataPreset>((resolve, reject) => {
    request("POST", "/database/rawDataPreset", rawDataPreset)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putRawDataPreset = (rawDataPreset: RawDataPreset) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/rawDataPreset", rawDataPreset)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};

export const deleteRawDataPreset = (rawDataPresetId: string) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/rawDataPreset/" + rawDataPresetId)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};
