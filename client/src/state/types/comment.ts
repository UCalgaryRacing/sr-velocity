// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export enum CommentType {
  SESSION = "Session",
  COLLECTION = "Collection",
}

export type Comment = {
  _id: string;
  userId: string;
  username: string;
  lastUpdate: number;
  content: string;
  sessionId?: string;
  collectionId?: string;
  commentId?: string;
  comments: Comment[];
};
