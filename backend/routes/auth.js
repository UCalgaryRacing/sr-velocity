// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

"use strict";

const express = require("express");
const auth = express.Router();
const call = require("../utilities/call");
const { withAnyAuth } = require("../middleware/auth");

auth.all(["/login", "/signup", "/forgotPassword"], async (req, res) => {
  call(process.env.DATABASE_MS_ROUTE + "/auth" + req.path, req.method, {
    headers: req.headers,
    json: req.body,
  }).then(async (response) => {
    if (response.status === 200) {
      for (const header in response.headers) {
        if (header === "set-cookie") {
          let cookies = response.headers[header][0].split(";");
          for (let cookie of cookies) {
            let split = cookie.trim().split("=");
            if (!["Max-Age", "Path", "HttpOnly"].includes(split[0])) {
              res.cookie(split[0], split[1], { httpOnly: true });
            }
          }
        }
      }
      if (response.body) {
        res.status(response.status).json(response.body).end();
      } else res.status(response.status).end();
    } else {
      res.status(response.status).end();
    }
  });
});

auth.get("/renew", withAnyAuth, (req, res) => {
  // TODO: Request a refresh token from the database service
});

auth.put("/changePassword", withAnyAuth, (req, res) => {
  // TODO: Hit the change password endpoint on the backend
});

auth.get("/validate", withAnyAuth, (req, res) => {
  res.sendStatus(200).end();
});

auth.post("/signout", withAnyAuth, (req, res) => {
  // TODO: Need to figure out with cookie keys to delete
  res.clearCookie().sendStatus(200).end();
});

module.exports = auth;
