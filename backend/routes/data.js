"use strict";

const express = require("express");
const data = express.Router();
const call = require("../utilities/call");

// TODO: Add authentication for specfic calls
data.all("*", async (req, res) => {
  const response = await call(
    process.env.DATA_API_ROUTE + req.path,
    req.method,
    {
      headers: req.headers,
      json: req.body,
    }
  );
  res.status(response.statusCode).json(response.body).end();
});

module.exports = data;
