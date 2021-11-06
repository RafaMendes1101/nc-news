const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  const queryStr = `SELECT * from comments WHERE article_id = $1;`;
  const articlesStr = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(articlesStr, [article_id]).then(({ rows }) => {
    if (rows.length < 1) {
      return Promise.reject({ status: 404, msg: "Article not found." });
    } else {
      return db.query(queryStr, [article_id]).then(({ rows }) => {
        return rows;
      });
    }
  });
};

exports.addComment = (id, data) => {
  const queryStr = `INSERT into comments (body, author, article_id) VALUES ($1, $2, $3 ) RETURNING*;`;
  const queryData = [data.body, data.author, id];

  if (!data.body && !data.author) {
    return Promise.reject({
      status: 400,
      msg: "Missing required field author and body.",
    });
  } else if (!data.body) {
    return Promise.reject({ status: 400, msg: "Missing required field body." });
  } else if (!data.author) {
    return Promise.reject({
      status: 400,
      msg: "Missing required field author.",
    });
  }
  const checkUser = `SELECT * from users where username = $1;`;

  return db.query(checkUser, [data.author]).then(({ rows }) => {
    if (rows.length < 1) {
      return Promise.reject({ status: 404, msg: "Username doesn't exist." });
    } else {
      return db.query(queryStr, queryData).then(({ rows }) => {
        return rows[0];
      });
    }
  });
};

exports.deleteComment = (id) => {
  const queryStr = `DELETE FROM comments WHERE comment_id = $1;`;
  const checkComment = `SELECT * FROM comments WHERE comment_id =$1;`;

  return db.query(checkComment, [id]).then(({ rows }) => {
    if (rows.length < 1) {
      return Promise.reject({ status: 404, msg: "Comment doesn't exist." });
    } else {
      return db.query(queryStr, [id]).then(({ rows }) => {
        return rows;
      });
    }
  });
};

exports.updateComment = (id, data) => {
  const commentToUpdate = `SELECT * FROM articles WHERE article_id = $1;`;
  let updateObj = {};
  return db.query(commentToUpdate, [id]).then(({ rows }) => {
    if (rows.length < 1) {
      return rows;
    } else {
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
    }
  });
};
