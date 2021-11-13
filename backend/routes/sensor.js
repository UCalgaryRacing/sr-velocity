"use strict";

const { response } = require("express");
const express = require("express");
const { withAnyAuth, withAdminAuth } = require("../middleware/auth");
const {database_request} = require('../utilities/request')
const sensor = express.Router();

// Get all sensors from a car
sensor.get("/vehicle/:vehicleId", withAnyAuth, async (req, res) => {
  const response = await database_request(`sensor/vehicle/${req.params.vehicleId}`, "GET", {});
  res.status(response.status).json(response.body).end();
});

// Add a sensor
sensor.post("/", withAdminAuth, async (req, res) => {
  const response = await database_request(`sensor`, "POST", {
    json: {
      name: req.body.name,
      vehicleId: req.body.vehicleId,
      outputUnit: req.body.outputUnit,
      category: req.body.category,
      codeName: req.body.codeName,
      canId: req.body.canId,
      frequency: req.body.frequency,
    },
  });
  res.status(response.status).json(response.body).end();
});

// Delete a sensor
sensor.delete("/:sensorId", withAdminAuth, async (req, res) => {
  const response = await api.call(`sensor/${req.params.sensorId}`, "DELETE", {});
  res.status(response.status).json(response.body).end();
});

module.exports = sensor;
