const {
  fetchComments,
  addComment,
  deleteComment,
} = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  fetchComments(req.params.article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.newComment = (req, res, next) => {
  addComment(req.body)
    .then((comment) => {
      res.status(201).send({ newComment: comment });
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  deleteComment(req.params.comment_id)
    .then((removedComment) => {
      res.status(204).send(removedComment);
    })
    .catch(next);
};
