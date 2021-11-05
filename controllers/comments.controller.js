const {
  fetchComments,
  addComment,
  deleteComment,
  updateComment,
} = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  fetchComments(req.params.article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.newComment = (req, res, next) => {
  addComment(req.params.article_id, req.body)
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

exports.updateComment = (req, res, next) => {
  updateComment(req.params.comment_id, req.body)
    .then((updatedComment) => {
      if (updatedComment.length < 1) {
        return Promise.reject({ status: 400, msg: "Comment not found" });
      } else {
        res.status(200).send({ updatedComment });
      }
    })
    .catch(next);
};
