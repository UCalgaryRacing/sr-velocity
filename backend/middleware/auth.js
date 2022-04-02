// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis, Arham Humayun
"use strict";
/*
* Calls the next function if the auth is the required one or higher
*/

const call = require("../utilities/call");
const permissionValues = {
  Pending: 1,
  Guest: 2,
  Member: 3,
  Lead: 4,
  Admin: 5,
}

async function hasAuth(req, res, next, required_perms) {

  // Parse header for cookies
  const rawCookies = req.headers.cookie.split('; ');
  const parsedCookies = {};
  rawCookies.forEach(rawCookie=>{
  const parsedCookie = rawCookie.split('=');
    parsedCookies[parsedCookie[0]] = parsedCookie[1];
  });

  // Verify if Authorization cookie exists
  if (!parsedCookies.Authorization) {
    res.status(401).send({ error: "Authorization cookie not found." }).end()
  }

  // Call DB MS route to verify cookie
  const path = process.env.DATABASE_MS_ROUTE + "/user/role/" + parsedCookies.Authorization;
  const authRes = await call(path, "GET");

  // Handle response
  if (authRes.body && authRes.body.success) {
    if (permissionValues[authRes.body.role] >= permissionValues[required_perms]) {
      next();
    } else {
    res.status(401).send({ error: "Permission denied." }).end()
    }
  } else {
    res.status(401).send({ error: "Authorizing cookie failed." }).end()
  }
}

async function withPendingAuth(req, res, next) {
  await hasAuth(req, res, next, "Pending")
}

async function withGuestAuth(req, res, next) {
  await hasAuth(req, res, next, "Guest")
}

async function withMemberAuth(req, res, next) {
  await hasAuth(req, res, next, "Member")
}

async function withLeadAuth(req, res, next) {
  await hasAuth(req, res, next, "Lead")
}

async function withAdminAuth(req, res, next) {
  await hasAuth(req, res, next, "Admin")
}


module.exports = { withPendingAuth, withGuestAuth, withMemberAuth, withLeadAuth, withAdminAuth };
