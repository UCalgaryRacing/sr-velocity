// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Comment = {
  _id: string;
  userId: string;
  username: string;
  time: number;
  content: string;
  sessionId?: string;
  collectionId?: string;
};
