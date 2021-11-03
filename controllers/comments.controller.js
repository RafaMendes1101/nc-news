const { fetchComments } = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  fetchComments(req.params.article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
