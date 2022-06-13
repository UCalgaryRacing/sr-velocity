"use strict";

const express = require("express");
const database = express.Router();
var FormData = require("form-data");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fetch = require("node-fetch");
const call = require("../utilities/call");

database.all("*", upload.any(), async (req, res) => {
  let headers = { ...req.headers };
  if (req.cookies) headers.authorization = "Bearer " + req.cookies.idToken;
  let body = req.body;
  if (req.files) {
    req.files.forEach((file) => {
      const formFile = new FormData();
      formFile.append("file", file.buffer, file.originalname);
      body = formFile;
      delete headers["content-type"];
      fetch(process.env.DATABASE_MS_ROUTE + req.path, {
        method: "POST",
        body: formFile,
        headers: headers,
      })
        .then((_) => res.status(200).end())
        .catch((_) => res.status(500).end());
    });
  } else {
    call(process.env.DATABASE_MS_ROUTE + req.path, req.method, {
      headers: headers,
      json: body,
    })
      .then(async (response) => {
        if (response.statusCode === 200) {
          if (response.body) {
            res.status(response.statusCode).json(response.body).end();
          } else if (response.headers["content-type"] === "text/csv") {
            let file = await response.blob();
            res.status(response.statusCode).send(file).end();
          } else {
            res.status(response.statusCode).end();
          }
        } else {
          res.status(response.statusCode).end();
        }
      })
      .catch((_) => {
        res.status(500).end();
      });
  }
});

module.exports = database;
