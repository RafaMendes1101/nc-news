const { fetchArticles, updateArticle } = require("../models/articles.model");
exports.getArticles = (req, res, next) => {
  fetchArticles(req.params.article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  updateArticle(req.params.article_id, req.body)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
