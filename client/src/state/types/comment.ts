// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Comment = {
  _id: string;
  user_id: string;
  time: string;
  content: string;
  sessionId?: string;
  runId?: string;
};
