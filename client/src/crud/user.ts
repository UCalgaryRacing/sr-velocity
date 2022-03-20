// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { User } from "state";
import { request } from "./request";

export const signIn = (credentials: any, set_user_callback: any) => {

  const promise = new Promise<void>((resolve, reject) => {
    request(
      "POST",
      "/database/login",
      credentials
    ).then((res: any) => {
      const user: User = {
        _id: res.userId,
        name: res.name,
        email: res.email,
        role: res.role
      }
      set_user_callback(user);
      
      resolve();

    }).catch((err: any) => {
      console.log(err)
      reject();
    })

  })

  return promise;
};

export const registerUser = (credentials: any) => {
  return new Promise<void>((resolve, reject) => { });
};

export const signUserOut = () => {
  return new Promise<void>((resolve, reject) => { });
};

export const validate = () => {
  return new Promise<void>((resolve, reject) => { });
};

export const putUser = (user: User) => {
  return new Promise<void>((resolve, reject) => { });
};

export const deleteUser = (userId: string) => {
  return new Promise<void>((resolve, reject) => { });
};

export const approveUser = (userId: string) => {
  return new Promise<void>((resolve, reject) => { });
};

export const classiftUser = (user: User) => {
  return new Promise<void>((resolve, reject) => { });
};
