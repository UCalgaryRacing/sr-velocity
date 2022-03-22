"use strict";

const express = require("express");
const database = express.Router();
const call = require("../utilities/call");

// TODO: Add authentication for specfic calls
database.all("*", async (req, res) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + "/database" + req.path,
    req.method,
    {
      headers: req.headers,
      json: req.body,
    }
  );

  for (const header in response.headers){
    res.setHeader(header, response.headers[header])
  }

  res.status(response.status).json(response.body).end();
});

module.exports = database;
