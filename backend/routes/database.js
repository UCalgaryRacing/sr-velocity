"use strict";

const express = require("express");
const database = express.Router();
const call = require("../utilities/call");

database.all("*", async (req, res) => {
  let headers = { ...req.headers };
  if (req.cookies) headers.authorization = "Bearer " + req.cookies.idToken;
  call(process.env.DATABASE_MS_ROUTE + req.path, req.method, {
    headers: headers,
    json: req.body,
  }).then(async (response) => {
    if (response.statusCode === 200) {
      if (response.body)
        res.status(response.statusCode).json(response.body).end();
      else res.status(response.statusCode).end();
    } else {
      res.status(response.statusCode).end();
    }
  });
});

module.exports = database;
