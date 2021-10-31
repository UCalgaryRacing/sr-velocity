"use strict";

const express = require("express");
const database = express.Router();
const call = require("../utilities/call");

// TODO: Add authentication for specfic calls
database.all("*", async (req, res) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + req.path,
    req.method,
    {
      headers: req.headers,
      json: req.body,
    }
  );
  res.status(response.status).json(response.body).end();
});

module.exports = database;
