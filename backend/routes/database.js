"use strict";

const express = require("express");
const database = express.Router();
const call = require("../utilities/call");

// No middleware applied because auth is already handled on the backend
database.all("*", async (req, res) => {
  call(process.env.DATABASE_MS_ROUTE + req.path, req.method, {
    headers: {
      ...req.headers,
      authorization: "Bearer " + req.cookies.idToken,
    },
    json: req.body,
  }).then(async (response) => {
    if (response.status === 200) {
      let body = await response.json();
      if (body) res.status(response.status).json(body).end();
      else res.status(response.status).end();
    } else {
      res.status(response.status).end();
    }
  });
});

module.exports = database;
