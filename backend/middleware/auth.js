// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

"use strict";

async function withAnyAuth(req, res, next) {
  next();
}

async function withAdminAuth(req, res, next) {
  next();
}

module.exports = { withAnyAuth, withAdminAuth };
