const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  const queryStr = `SELECT * from comments WHERE article_id = $1;`;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  });
};
