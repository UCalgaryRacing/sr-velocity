// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Collection, Comment } from "state";

export const getCollections = (thingId: string) => {
  return new Promise<Collection[]>((resolve, reject) => {});
};

export const postCollection = (collection: Collection) => {
  return new Promise<void>((resolve, reject) => {});
};

export const putCollection = (collection: Collection) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteCollection = (collectionId: string) => {
  return new Promise<void>((resolve, reject) => {});
};

export const getCollectionComments = (collectionId: Collection) => {
  return new Promise<Comment[]>((resolve, reject) => {});
};

export const postCollectionComment = (comment: Comment) => {
  return new Promise<void>((resolve, reject) => {});
};

export const putCollectionComment = (comment: Comment) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteCollectionComment = (commentId: string) => {
  return new Promise<void>((resolve, reject) => {});
};
