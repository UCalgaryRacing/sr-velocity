// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { ChartPreset } from "state";
import { request } from ".";

export const getChartPresets = (thingId: string) => {
  return new Promise<ChartPreset[]>((resolve, reject) => {
    request("GET", "/database/chartPreset/thing/" + thingId)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const postChartPreset = (chartPreset: ChartPreset) => {
  return new Promise<ChartPreset>((resolve, reject) => {
    request("POST", "/database/chartPreset", chartPreset)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putChartPreset = (chartPreset: ChartPreset) => {
  return new Promise<ChartPreset>((resolve, reject) => {
    request("PUT", "/database/chartPreset", chartPreset)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const deleteChartPreset = (chartPresetId: string) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/chartPreset/" + chartPresetId)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};
