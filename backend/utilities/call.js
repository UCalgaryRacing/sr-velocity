"use strict";

const got = require("got");

const call = async (path, method = "GET", options = {}) => {
  // Setup the request
  options = options || {};
  const searchParams = options.searchParams || {};
  const headers = options.headers || {};
  let json = options.json || {};
  json = method === "GET" ? undefined : json;

  // Make the request
  let res;
  try {
    res = await got(path, {
      headers,
      searchParams,
      method,
      json,
      responseType: "json",
    });
  } catch (error) {
    return error.response;
  }

  // Return the response
  return res;
};

module.exports = call;
