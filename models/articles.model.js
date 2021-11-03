const db = require("../db/connection");
exports.fetchArticles = (id) => {
  let queryStr = `SELECT * FROM articles`;
  const queryParams = [];
  if (id !== undefined) {
    queryStr += ` WHERE article_id = $1;`;
    queryParams.push(id);
  }
  return db.query(queryStr, queryParams).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticle = (id, data) => {
  let queryStr = `UPDATE articles SET `;
  let dataArray = Object.entries(data);
  dataArray.forEach((e, i) => {
    queryStr += `${e[0]} = '${e[1]}'`;
    if (i + 1 < dataArray.length) {
      queryStr += `, `;
    }
  });
  queryStr += ` WHERE article_id = $1;`;

  return db.query(queryStr, [id]).then(() => {
    return db
      .query(`SELECT * from articles where article_id = $1`, [id])
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
