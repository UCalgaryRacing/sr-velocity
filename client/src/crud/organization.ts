// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import { Organization } from "state";

export const getOrganizationNames = () => {
  return new Promise<string[]>((resolve, reject) => {});
};

export const getOrganization = (organizationId: string) => {
  return new Promise<Organization>((resolve, reject) => {});
};

export const putOrganization = (organization: Organization) => {
  return new Promise<void>((resolve, reject) => {});
};

export const deleteOrganization = (organizationId: string) => {
  return new Promise<void>((resolve, reject) => {});
};
