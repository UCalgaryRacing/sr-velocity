// Copyright Schulich Racing, FSAE
// Written by Arham Humayun, Justin Tijunelis

const permissionValues = {
  Admin: 4,
  Lead: 3,
  Member: 2,
  Guest: 1,
  Pending: 0,
};

const call = require("../utilities/call");

const withMinimumAuth = (permission) => {
  return (req, res, next) => {
    call(process.env.DATABASE_MS_ROUTE + "/auth/validate", "GET", {
      headers: req.headers,
    }).then(async (response) => {
      if (response.statusCode === 200 && response.body) {
        if (
          permissionValues[response.body.data.role] >=
          permissionValues[permission]
        ) {
          next();
        } else {
          res.status(401).json({ data: null, message: "Unauthorized." }).end();
        }
      } else {
        res.status(401).json({ data: null, message: "Unauthorized." }).end();
      }
    });
  };
};

const isTokenValid = (token) => {
  // TODO - Add to cookies when making request
  return true;
};

const isApiKeyValid = (apiKey) => {
  // TODO - Add to headers when making request
  return true;
};

const isNewRoomSecretValid = (secret) => {
  return secret === process.env.NEW_ROOM_SECRET;
};

module.exports = {
  withMinimumAuth,
  isTokenValid,
  isApiKeyValid,
  isNewRoomSecretValid,
};
