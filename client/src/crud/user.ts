// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { User } from "state";
import { request } from "./request";

export const signIn = (credentials: any) => {
  return new Promise<User>((resolve, reject) => {
    request("POST", "/auth/login", credentials)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const registerUser = (credentials: any) => {
  return new Promise<void>((resolve, reject) => {
    request("POST", "/auth/signup", credentials)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};

export const signUserOut = () => {
  return new Promise<void>((resolve, reject) => {
    request("POST", "/auth/signout")
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};

export const getUsers = () => {
  return new Promise<User[]>((resolve, reject) => {
    request("POST", "/users")
      .then((users: User[]) => resolve(users))
      .catch((err: any) => reject(err));
  });
};

export const putUser = (user: User) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/users", user)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};

export const changeUserRole = (user: User) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/users/promote", user)
      .then((_: any) => resolve())
      .catch((err: any) => reject());
  });
};

export const deleteUser = (userId: string) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/users/" + userId)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};
