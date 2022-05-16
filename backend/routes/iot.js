"use strict";

const express = require("express");
const iot = express.Router();
const call = require("../utilities/call");
const { withMinimumAuth } = require("../middleware/auth");

iot.all("*", withMinimumAuth("Lead"), async (req, res) => {
  call(process.env.IOT_MS_ROUTE + req.path, req.method, {
    headers: req.headers,
    json: req.body,
  })
    .then(async (response) => {
      if (response.statusCode === 200) {
        if (response.body)
          res.status(response.statusCode).json(response.body).end();
        else res.status(response.statusCode).end();
      } else {
        res.status(response.statusCode).end();
      }
    })
    .catch((_) => {
      res.status(500).end();
    });
});

module.exports = iot;
