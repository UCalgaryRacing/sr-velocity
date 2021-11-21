"use strict";

const express = require("express");
const iot = express.Router();
const call = require("../utilities/call");

// TODO: Add authentication for specfic calls
iot.all("*", async (req, res) => {
  const response = await call(process.env.IOT_MS_ROUTE + req.path, req.method, {
    headers: req.headers,
    json: req.body,
  });
  res.status(response.status).json(response.body).end();
});

module.exports = iot;
