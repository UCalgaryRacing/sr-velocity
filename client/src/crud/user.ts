// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { useAppDispatch, User, UserActionType, userSignedIn } from "state";
import { request } from "./request";
import { bindActionCreators } from "redux";
import Cookies from "js-cookie";

export const signIn = (credentials: any) => {
  const promise = new Promise<void>((resolve, reject) => {
    request(
      "POST",
      "/database/login",
      credentials
    ).then((res: any) => {
      Cookies.set("SR Velocity", res)
      const user: User = {
        _id: Cookies.get('userId') ?? "",
        name: Cookies.get('name') ?? "",
        email: Cookies.get('email') ?? "",
        role: Cookies.get('role') ?? ""
      }
      console.log(Cookies.get())

      const set_user = bindActionCreators(userSignedIn, useAppDispatch());
      set_user(user);

      resolve();

    }).catch((_: any) => {
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
