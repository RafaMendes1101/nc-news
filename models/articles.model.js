const db = require("../db/connection");

exports.fetchArticles = (
  id,
  sort = "created_at",
  order = "desc",
  topic = "mitch"
) => {
  let queryStr = `SELECT * FROM articles`;
  const queryParams = [];

  if (id !== undefined) {
    queryStr += ` WHERE article_id = $1`;
    queryParams.push(id);
  } else {
    queryStr += ` WHERE topic = $1`;
    queryParams.push(topic);
  }
  queryStr += ` ORDER BY ${sort} ${order.toUpperCase()};`;

  return db.query(queryStr, queryParams).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticle = (id, data) => {
  const articleToUpdate = `SELECT * FROM articles WHERE article_id = $1;`;
  let updateObj = {};

  return db
    .query(articleToUpdate, [id])
    .then(({ rows }) => {
      rows[0].votes = rows[0].votes + data.inc_votes;
      updateObj = rows[0];
      const updateVotes = Object.values(updateObj)[3];
      return db
        .query(
          `UPDATE articles SET votes = ${updateVotes} WHERE article_id = $1 RETURNING*;`,
          [id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    })
    .catch((err) => {
      return err;
    });
};
