// Copyright Schulich Racing FSAE
// Written by Ryan Painchaud, Justin Tijunelis

// Can this, sensors, and vehicles be concatenated somehow?

import { Dispatch } from "redux";
import { Operator } from "../types";

export enum OperatorActionType {
  FETCHED = "operatorsFetched",
  OPERATOR_CREATED = "operatorCreated",
  OPERATOR_UPDATED = "operatorUpdated",
  OPERATOR_DELETED = "operatorDeleted",
}

interface OperatorsFetchedAction {
  type: OperatorActionType.FETCHED;
  payload: Operator[];
}

interface OperatorCreatedAction {
  type: OperatorActionType.OPERATOR_CREATED;
  payload: Operator;
}

interface OperatorUpdatedAction {
  type: OperatorActionType.OPERATOR_UPDATED;
  payload: Operator;
}

interface OperatorDeletedAction {
  type: OperatorActionType.OPERATOR_DELETED;
  payload: Operator;
}

export type OperatorAction =
  | OperatorsFetchedAction
  | OperatorCreatedAction
  | OperatorUpdatedAction
  | OperatorDeletedAction;

export const operatorssFetched = (operators: Operator[]) => {
  return (dispatch: Dispatch<OperatorsFetchedAction>) => {
    dispatch({
      type: OperatorActionType.FETCHED,
      payload: operators,
    });
  };
};

export const operatorCreated = (operator: Operator) => {
  return (dispatch: Dispatch<OperatorCreatedAction>) => {
    dispatch({
      type: OperatorActionType.OPERATOR_CREATED,
      payload: operator,
    });
  };
};

export const operatorUpdated = (operator: Operator) => {
  return (dispatch: Dispatch<OperatorUpdatedAction>) => {
    dispatch({
      type: OperatorActionType.OPERATOR_UPDATED,
      payload: operator,
    });
  };
};

export const operatorDeleted = (operator: Operator) => {
  return (dispatch: Dispatch<OperatorDeletedAction>) => {
    dispatch({
      type: OperatorActionType.OPERATOR_DELETED,
      payload: operator,
    });
  };
};
