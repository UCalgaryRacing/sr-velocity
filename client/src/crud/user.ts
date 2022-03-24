// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { User } from "state";
import { request } from "./request";

export const signIn = (credentials: any) => {
  return new Promise<User>((resolve, reject) => {
    request("POST", "/auth/login", credentials)
      .then((res: any) => {
        const user: User = {
          _id: res.userId,
          name: res.name,
          email: res.email,
          role: res.role,
        };
        resolve(user);
      })
      .catch((_: any) => reject());
  });
};

export const registerUser = (credentials: any) => {
  return new Promise<void>((resolve, reject) => {});
};

export const signUserOut = () => {
  return new Promise<void>((resolve, reject) => {});
};

export const validate = () => {
  return new Promise<void>((resolve, reject) => {});
};

export const putUser = (user: User) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteUser = (userId: string) => {
  return new Promise<void>((resolve, reject) => {});
};

export const approveUser = (userId: string) => {
  return new Promise<void>((resolve, reject) => {});
};

export const classiftUser = (user: User) => {
  return new Promise<void>((resolve, reject) => {});
};
