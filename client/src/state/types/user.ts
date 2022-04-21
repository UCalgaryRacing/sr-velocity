// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

const RoleLevel = {
  Pending: 0,
  Guest: 1,
  Member: 2,
  Lead: 3,
  Admin: 4,
};

export enum UserRole {
  PENDING = "Pending",
  GUEST = "Guest",
  MEMBER = "Member",
  LEAD = "Lead",
  ADMIN = "Admin",
}

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
};

export const isAuthAtLeast = (user: User | null, role: UserRole) => {
  if (user === null) return false;
  else return RoleLevel[user.role] >= RoleLevel[role];
};
