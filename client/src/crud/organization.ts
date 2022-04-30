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

export const getOrganization = () => {
  return new Promise<Organization>((resolve, reject) => {
    request("GET", "/database/organization")
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const putOrganization = (organization: Organization) => {
  return new Promise<void>((resolve, reject) => {
    request("PUT", "/database/organization", organization)
      .then((_: any) => resolve())
      .catch((err: any) => reject(err));
  });
};

export const issueNewAPIKey = () => {
  return new Promise<string>((resolve, reject) => {
    request("PUT", "/database/organization/issueNewAPIKey")
      .then((res: any) => resolve(res.data))
      .catch((err: any) => reject(err));
  });
};

export const deleteOrganization = (organizationId: string) => {
  return new Promise<void>((resolve, reject) => {
    // Probably don't even want to implement this right now
  });
};
