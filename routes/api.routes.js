const apiRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");
const {
  getComments,
  newComment,
  removeComment,
} = require("../controllers/comments.controller");
const {
  getArticles,
  updateArticle,
} = require("../controllers/articles.controller");
const { getUsers, getUser } = require("../controllers/users.controller");
apiRouter.get("/topics", getTopics);
apiRouter.get("/articles", getArticles);
apiRouter.get("/users", getUsers);
apiRouter.get("/users/:username", getUser);
apiRouter
  .get("/articles/:article_id", getArticles)
  .patch("/articles/:article_id", updateArticle);
apiRouter
  .get("/articles/:article_id/comments", getComments)
  .post("/articles/:article_id/comments", newComment);
apiRouter.delete("/comments/:comment_id", removeComment);

module.exports = apiRouter;
