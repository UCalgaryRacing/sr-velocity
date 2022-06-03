// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export type Session = {
  _id: string;
  name: string;
  startTime: number;
  endTime?: number;
  fileSize?: number;
  generated: boolean;
  collectionId?: string;
  operatorId?: string;
};
