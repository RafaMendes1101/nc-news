const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  const queryStr = `SELECT * from comments WHERE article_id = $1;`;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.addComment = (data) => {
  const queryStr = `INSERT into comments (body, votes, author, article_id) VALUES ($1, $2, $3, $4) RETURNING*;`;
  const queryData = [data.body, data.votes, data.author, data.article_id];
  return db.query(queryStr, queryData).then(({ rows }) => {
    return rows[0];
  });
};

exports.deleteComment = (id) => {
  const queryStr = `DELETE FROM comments WHERE comment_id = $1;`;

  return db.query(queryStr, [id]).then(({ rows }) => {
    return rows;
  });
};
