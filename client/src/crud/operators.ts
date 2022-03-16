// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Operator } from "state";

export const getOperators = (thingId: string) => {
  return new Promise<Operator[]>((resolve, reject) => {});
};

export const postOperator = (operator: Operator) => {
  return new Promise<void>((resolve, reject) => {});
};

export const putOperator = (operator: Operator) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteOperator = (operatorId: string) => {
  return new Promise<void>((resolve, reject) => {});
};
