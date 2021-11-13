"use strict";

const got = require("got");

async function request(prefixURL, path, method="GET", options = {}) {
	// Setup the request
	options = options || {};
	const searchParams = options.searchParams || {};
	const headers = options.headers || {};
	let json = options.json || {};
	json = method === "GET" ? undefined : json;
	let res;

	// Make the request
	try {
		res = await got(path, {
			headers,
			searchParams,
			method,
			json,
			prefixURL: prefixURL,
			responseType: "json",
		});
	} catch (error) {
		return { status: 500 };
	}

	// Return the response
	res = { status: res.statusCode, body: res.body };
	return res;
}

async function database_request(path, method="GET", options = {}) {
	request(process.env.DATABASE_MS_IP + ":" + process.env.DATABASE_MS_PORT);
}

async function data_api_request(path, method="GET", options = {}) {
	request(process.env.DATA_API_MS_IP + ":" + process.env.DATA_API_MS_PORT);
}

async function iot_request(path, method="GET", options = {}) {
	request(process.env.IOT_MS_IP + ":" + process.env.IOT_MS_PORT);
}

module.exports = {database_request, data_api_request, iot_request};
