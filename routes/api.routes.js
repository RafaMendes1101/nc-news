const apiRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");

apiRouter.get("/topics", getTopics);

module.exports = apiRouter;
