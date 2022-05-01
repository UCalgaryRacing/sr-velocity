// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Operator } from "state";
import { request } from ".";

export const getOperators = () => {
  return new Promise<Operator[]>((resolve, reject) => {
    request("GET", "/database/operators")
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const postOperator = (operator: Operator) => {
  return new Promise<Operator>((resolve, reject) => {
    request("POST", "/database/operators", operator)
      .then((res: any) => resolve(res.data))
      .then((err: any) => reject(err));
  });
};

export const putOperator = (operator: Operator) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/operators", operator)
      .then((_: any) => resolve())
      .then((err: any) => reject(err));
  });
};

export const deleteOperator = (operatorId: string) => {
  return new Promise<void>((resolve, reject) => {
    request("DELETE", "/database/operators/" + operatorId)
      .then((_: any) => resolve())
      .then((err: any) => reject(err));
  });
};
