// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Dispatch } from "redux";

export enum DashboardActionType {
  PAGE_SELECTED = "pageSelected",
}

interface DashboardPageSelectedAction {
  type: DashboardActionType.PAGE_SELECTED;
  payload: string;
}

export type DashboardAction = DashboardPageSelectedAction;

export const dashboardPageSelected = (page: string) => {
  return (dispatch: Dispatch<DashboardPageSelectedAction>) => {
    dispatch({
      type: DashboardActionType.PAGE_SELECTED,
      payload: page,
    });
  };
};
