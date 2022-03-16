// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Thing } from "state";

export const getThings = () => {
  return new Promise<Thing[]>((resolve, reject) => {});
};

export const postThing = (thing: Thing) => {
  return new Promise<void>((resolve, reject) => {});
};

export const putThing = (thing: Thing) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteThing = (thingId: string) => {
  return new Promise<void>((resolve, reject) => {});
};
