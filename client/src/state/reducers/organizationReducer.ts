// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { OrganizationAction, OrganizationActionType } from "../actions";
import { Organization } from "../types";

const organizationReducer = (
  state: Organization | null = null,
  action: OrganizationAction
): Organization | null => {
  switch (action.type) {
    case OrganizationActionType.FETCHED: {
      let organization: Organization = action.payload;
      return { ...state, ...organization };
    }
    default: {
      return state;
    }
  }
};

export default organizationReducer;
