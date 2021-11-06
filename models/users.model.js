const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchUsers = () => {
  const queryStr = `SELECT * from users;`;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  const queryStr = `SELECT * from users WHERE username = $1;`;
  return db.query(queryStr, [username]).then(({ rows }) => {
    if (rows.length < 1) {
      return Promise.reject({ status: 404, msg: "User not found." });
    } else {
      return rows;
    }
  });
};
