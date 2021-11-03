const { fetchComments, addComment } = require("../models/comments.model");

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
