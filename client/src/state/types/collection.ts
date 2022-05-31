// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Comment } from ".";

export type Collection = {
  _id: string;
  name: string;
  comments?: Comment[];
};
