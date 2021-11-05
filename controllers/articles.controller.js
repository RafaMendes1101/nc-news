const { fetchArticles, updateArticle } = require("../models/articles.model");
exports.getArticles = (req, res, next) => {
  let { sort, order, topic } = req.query;

  fetchArticles(req.params.article_id, sort, order, topic)
    .then((articles) => {
      if (articles.length < 1) {
        return Promise.reject({ status: 404, msg: "Article not found." });
      } else {
        res.status(200).send({ articles });
      }
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  updateArticle(req.params.article_id, req.body)
    .then((updatedArticle) => {
      if (updatedArticle.article_id === undefined) {
        return Promise.reject({ status: 400, msg: "Article not found." });
      } else {
        res.status(200).send({ updatedArticle });
      }
    })
    .catch(next);
};
