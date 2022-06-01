// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Comment } from ".";

export type Session = {
  _id: string;
  name: string;
  startTime: number;
  endTime: number;
  collectionId: string;
};
