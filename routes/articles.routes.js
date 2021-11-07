const articlesRouter = require("express").Router();
const {
  getArticles,
  updateArticle,
} = require("../controllers/articles.controller");
const {
  getComments,
  newComment,
} = require("../controllers/comments.controller");

articlesRouter.get("/", getArticles);
articlesRouter
  .get("/:article_id", getArticles)
  .patch("/:article_id", updateArticle);
articlesRouter
  .get("/:article_id/comments", getComments)
  .post("/:article_id/comments", newComment);

module.exports = articlesRouter;
