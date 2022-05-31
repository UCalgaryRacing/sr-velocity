// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Session, Comment } from "state";

export const getSessions = (thingId: string) => {
  return new Promise<Session[]>((resolve, reject) => {});
};

export const postSession = (session: Session) => {
  return new Promise<void>((resolve, reject) => {});
};

export const putSession = (session: Session) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteSession = (sessionId: string) => {
  return new Promise<void>((resolve, reject) => {});
};

export const getSessionComments = (sessionId: string) => {
  return new Promise<Comment[]>((resolve, reject) => {});
};

export const postSessionComment = (comment: Comment) => {
  return new Promise<void>((resolve, reject) => {});
};

export const putSessionComment = (comment: Comment) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteSessionComment = (commentId: Comment) => {
  return new Promise<void>((resolve, reject) => {});
};
