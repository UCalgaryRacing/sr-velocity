// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Run, Comment } from "state";

export const getRuns = (thingId: string) => {
  return new Promise<Run[]>((resolve, reject) => {});
};

export const postRun = (run: Run) => {
  return new Promise<void>((resolve, reject) => {});
};

export const putRun = (run: Run) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteRun = (runId: string) => {
  return new Promise<void>((resolve, reject) => {});
};

export const getRunComments = (runId: string) => {
  return new Promise<Comment[]>((resolve, reject) => {});
};

export const postRunComment = (comment: Comment) => {
  return new Promise<void>((resolve, reject) => {});
};

export const putRunComment = (comment: Comment) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteRunComment = (commentId: Comment) => {
  return new Promise<void>((resolve, reject) => {});
};
