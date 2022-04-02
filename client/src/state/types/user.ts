// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

export enum UserRole {
  PENDING = "pending",
  GUEST = "guest",
  LEAD = "lead",
  ADMIN = "admin",
}

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
};
