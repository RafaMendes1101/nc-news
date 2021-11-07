const {
  removeComment,
  updateComment,
} = require("../controllers/comments.controller");
const commentsRouter = require("express").Router();
commentsRouter
  .delete("/:comment_id", removeComment)
  .patch("/:comment_id", updateComment);

module.exports = commentsRouter;
