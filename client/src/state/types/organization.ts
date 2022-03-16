// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { User, Thing } from "state";

export type Organization = {
  _id: string;
  name: string;
  key: string;
  users: User[];
  things: Thing[];
};
