// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Dispatch } from "redux";
import { Organization } from "../types";

export enum OrganizationActionType {
  FETCHED = "organizationFetched",
}

interface OrganizationFetchedAction {
  type: OrganizationActionType.FETCHED;
  payload: Organization;
}

export type OrganizationAction = OrganizationFetchedAction;

export const organizationFetched = (organization: Organization) => {
  return (dispatch: Dispatch<OrganizationAction>) => {
    dispatch({
      type: OrganizationActionType.FETCHED,
      payload: organization,
    });
  };
};
