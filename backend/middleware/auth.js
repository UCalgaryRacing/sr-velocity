// Copyright Schulich Racing, FSAE
// Written by Arham Humayun, Justin Tijunelis

const roles = {
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
    })
      .then(async (response) => {
        if (response.statusCode === 200 && response.body) {
          if (roles[response.body.data.role] >= roles[permission]) {
            next();
          } else {
            res
              .status(401)
              .json({ data: null, message: "Unauthorized." })
              .end();
          }
        } else {
          res.status(401).json({ data: null, message: "Unauthorized." }).end();
        }
      })
      .catch((_) => {
        res.status(401).json({ data: null, message: "Unauthorized." }).end();
      });
  };
};

const isCookieValid = async (cookie) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + "/auth/validate",
    "GET",
    { headers: { cookie: cookie } }
  );
  if (!response) return false;
  if (response.statusCode === 200 && response.body) {
    return roles[response.body.data.role] >= roles["Guest"];
  }
  return false;
};

const isApiKeyValid = async (apiKey) => {
  const response = await call(
    process.env.DATABASE_MS_ROUTE + "/auth/validate",
    "GET",
    { headers: { apiKey: apiKey } }
  );
  if (!response) return false;
  if (response.statusCode === 200 && response.body)
    return response.body.data.role === "Admin";
  return false;
};

const isNewRoomSecretValid = (secret) => {
  return secret === process.env.NEW_ROOM_SECRET;
};

module.exports = {
  withMinimumAuth,
  isCookieValid,
  isApiKeyValid,
  isNewRoomSecretValid,
};
