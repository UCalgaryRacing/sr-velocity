// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis, Arham Humayun

"use strict";
/*
* Calls the next function if the auth is the required one or higher
*/

const permissionValues = {
  Pending: 1,
  Guest: 2,
  Member: 3,
  Lead: 4,
  Admin: 5,
}

async function hasAuth(req, res, next, required_perms) {
  // from req extract jwt token
  // call go server to get role, 
  // compare role to required perm
  // if the role is sufficient call next(), 
  // else return error with res.status().message().end()

  console.log(req)

  return permissionValues[perms] >= permissionValues[required_perms]
}

async function withPendingAuth(req, res, next) {
  hasAuth(req, res, next, "Pending")
}

async function withGuestAuth(req, res, next) {
  hasAuth(req, res, next, "Guest")
}

async function withMemberAuth(req, res, next) {
  hasAuth(req, res, next, "Member")
}

async function withLeadAuth(req, res, next) {
  hasAuth(req, res, next, "Lead")
}

async function withAdminAuth(req, res, next) {
  hasAuth(req, res, next, "Admin")
}


module.exports = { withPendingAuth, withGuestAuth, withMemberAuth, withLeadAuth, withAdminAuth };
