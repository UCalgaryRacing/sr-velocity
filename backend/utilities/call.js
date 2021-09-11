"use strict";

const got = require("got");

class Call {
	constructor() {
		this.api = got.extend({
			responseType: "json",
		});
	}

	setPrefixURL(url) {
		this.api = this.api.extend({
			prefixUrl: url,
		});
	}

	async call(path, method="GET", options = {}) {
		// Setup the request
		options = options || {};
		const searchParams = options.searchParams || {};
		const headers = options.headers || {};
		let json = options.json || {};
		json = method === "GET" ? undefined : json;
		let res;

		// Make the request
		try {
			res = await this.api(path, {
				headers,
				searchParams,
				method,
				json,
			});
		} catch (error) {
			return { status: 500 };
		}

		// Return the response
		res = { status: res.statusCode, body: res.body };
		return res;
	}
}

var api = new Call();
module.exports = api;
