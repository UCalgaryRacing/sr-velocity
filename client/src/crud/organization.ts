// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Organization } from "state";
import { request } from ".";

export const getOrganizationNames = () => {
  return new Promise<any[]>((resolve, reject) => {
    request("GET", "/database/organizations")
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const getOrganization = (organizationId: string) => {
  return new Promise<Organization>((resolve, reject) => {
    request("GET", "/database/organizations/" + organizationId)
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putOrganization = (organization: Organization) => {
  return new Promise<void>((resolve, reject) => {
    // Not completed on the db service
  });
};

export const deleteOrganization = (organizationId: string) => {
  return new Promise<void>((resolve, reject) => {
    // Probably don't even want to implement this right now
  });
};
