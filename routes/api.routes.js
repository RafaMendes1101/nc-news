const apiRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");

const {
  getArticles,
  updateArticle,
} = require("../controllers/articles.controller");

apiRouter.get("/topics", getTopics);
apiRouter.get("/articles", getArticles);
apiRouter
  .get("/articles/:article_id", getArticles)
  .patch("/articles/:article_id", updateArticle);

module.exports = apiRouter;
