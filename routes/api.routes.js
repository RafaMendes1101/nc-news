const apiRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");
const { getComments } = require("../controllers/comments.controller");
const {
  getArticles,
  updateArticle,
} = require("../controllers/articles.controller");

apiRouter.get("/topics", getTopics);
apiRouter.get("/articles", getArticles);
apiRouter
  .get("/articles/:article_id", getArticles)
  .patch("/articles/:article_id", updateArticle);
apiRouter.get("/articles/:article_id/comments", getComments);

module.exports = apiRouter;
