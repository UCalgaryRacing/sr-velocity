// Copyright Schulich Racing, FSAE
// Written by Arham Humayun, Justin Tijunelis

const permissionValues = {
  Admin: 4,
  Lead: 3,
  Member: 2,
  Guest: 1,
  Pending: 0,
};

const withMinimumAuth = (permission, jwtRequired = false) => {
  return (req, res, next) => {
    next();
    // Read the current token and determine the permission level
    // Make request directly to db service to determine the permission role
    // Use the response to go to next or reject
  };
};

module.exports = { withMinimumAuth };
