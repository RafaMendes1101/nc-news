const fs = require("fs");
const endpoints = require("../endpoints.json");

exports.getEndpointsJson = async (req, res, next) => {
  res.status(200).send({ endPoints: JSON.parse(JSON.stringify(endpoints)) });
};
