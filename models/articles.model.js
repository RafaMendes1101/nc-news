const db = require("../db/connection");
exports.fetchArticles = async (id) => {
  let queryStr = `SELECT * FROM articles`;
  const queryParams = [];
  if (id !== undefined) {
    queryStr += ` WHERE article_id = $1;`;
    queryParams.push(id);
  }
  const result = await db.query(queryStr, queryParams);

  return result.rows;
};

exports.updateArticle = async (id, data) => {
  let queryStr = `UPDATE articles SET `;
  let dataArray = Object.entries(data);
  dataArray.forEach((e, i) => {
    queryStr += `${e[0]} = '${e[1]}'`;
    if (i + 1 < dataArray.length) {
      queryStr += `, `;
    }
  });
  queryStr += ` WHERE article_id = $1;`;

  await db.query(queryStr, [id]);
  const result = await db.query(
    `SELECT * from articles where article_id = $1`,
    [id]
  );
  return result.rows[0];
};
