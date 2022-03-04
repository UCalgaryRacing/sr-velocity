"use strict";

const express = require("express");
const { withAnyAuth, withAdminAuth } = require("../middleware/auth");
const database = express.Router();
const call = require("../utilities/call");

/*
* Get all sensors from thing
*/
database.get("/sensors/thingId/:thingId", async (req, res) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + "sensors/thingId/" + req.params.thingID,
    "GET", {
      searchParams: {
        apiKey: req.APIKey, // TODO do we actually need api key from this?
      },
    }
  );
  res.status(response.status).json(response.body).end();
});

/*
* Get specific sensor from thing
*/
database.get("/sensors/sensorID/:sensorID", async (req, res) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + "sensors/sensorID/" + req.params.sensorID,
    "GET", {
      searchParams: {
        apiKey: req.APIKey, // TODO do we actually need api key for this?
      },
    }
  );
  res.status(response.status).json(response.body).end();
});

// TODO get all things in organization
// TODO post a sensor

/*
* Get all users from organization
*/
database.get("/users", withAdminAuth, async (req, res) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + "users/" ,
    "GET", {
      searchParams: {
        apiKey: req.apiKey, // TODO get api key for organization from somewhere.
      },
    }
  );
  res.status(response.status).json(response.body).end();
});

/*
* Get specific user from org
* Admin auth for now until we figure out how to do login :)
*/
database.get("/users/:userId", withAdminAuth, async (req, res) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + "users/" + req.params.userId ,
    "GET", {
      searchParams: {
        apiKey: req.apiKey, // TODO get api key for organization from somewhere.
      },
    }
  );
  res.status(response.status).json(response.body).end();
});

/*
* Add a user to the org
* TODO: what do we actually return here
*/
database.post("/users", withAdminAuth, async (req, res) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + "users/",
    "POST", {
      searchParams: {
        apiKey: req.apiKey, // TODO get api key for organization from somewhere.
      },
      json: {
        // TODO put team member information in here
      }
    }
  );
  res.status(response.status).json(response.body).end();
});


// TODO add routes for sessions... talk with db microservice team

module.exports = database;
