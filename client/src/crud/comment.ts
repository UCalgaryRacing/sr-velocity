// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { request } from "./request";
import { Comment } from "state";

// TODO: Update go db to use one comment model, rip sessions out.

export const getComments = (contextId: string) => {
  return new Promise<Comment[]>((resolve, reject) => {
    request("GET", "/database/comments/" + contextId)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const postComment = (comment: Comment) => {
  return new Promise<Comment>((resolve, reject) => {
    request("POST", "/database/comments", comment)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putComment = (comment: Comment) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/comments/", comment)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const deleteComment = (commentId: Comment) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/comments/" + commentId)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};
