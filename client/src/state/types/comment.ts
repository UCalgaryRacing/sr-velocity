// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Comment = {
  _id: string;
  userId: string;
  time: string;
  content: string;
  sessionId?: string;
  collectionId?: string;
};
