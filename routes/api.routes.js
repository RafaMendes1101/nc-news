const apiRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");
const { getEndpointsJson } = require("../controllers/api.controller");

apiRouter.get("/", getEndpointsJson);
apiRouter.get("/topics", getTopics);

module.exports = apiRouter;
