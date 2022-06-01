// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Session = {
  _id: string;
  name: string;
  startTime: number;
  endTime?: number;
  collectionId?: string;
  operatorId?: string;
};
