// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export enum CommentType {
  SESSION = "sessionId",
  COLLECTION = "collectionId",
  THING = "thingId",
  SENSOR = "sensorId",
  OPERATOR = "operatorId",
}

export type Comment = {
  _id: string;
  userId: string;
  username: string;
  time: number;
  content: string;
  sessionId?: string;
  collectionId?: string;
  thingId?: string;
  sensorId?: string;
  operatorId?: string;
  commentId?: string;
  comments: Comment[];
};
