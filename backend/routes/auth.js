// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

"use strict";

const express = require("express");
const auth = express.Router();
const call = require("../utilities/call");
const { withMinimumAuth } = require("../middleware/auth");

auth.all(
  ["/login", "/signup", "/forgotPassword", "/changePassword", "/validate", "/renew"],
  async (req, res) => {
    call(process.env.DATABASE_MS_ROUTE + "/auth" + req.path, req.method, {
      headers: req.headers,
      json: req.body,
    })
      .then(async (response) => {
        if (response.statusCode === 200) {
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
            res.status(response.statusCode).json(response.body).end();
          } else res.status(response.statusCode).end();
        } else {
          res.status(response.statusCode).end();
        }
      })
      .catch((err) => {
        res.status(500).end();
      });
  }
);

// auth.get("/renew", withMinimumAuth("Member"), (req, res) => {
//   // TODO: Request a refresh token from the database service
// });

auth.post("/signout", withMinimumAuth("Member"), (req, res) => {
  // TODO: Need to figure out with cookie keys to delete
  // TODO: Blacklist the token
  res.clearCookie("Authorization").sendStatus(200).end();
});

module.exports = auth;
