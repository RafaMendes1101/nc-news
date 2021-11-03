const { query } = require("../db/connection");
const db = require("../db/connection");

exports.fetchUsers = () => {
  const queryStr = `SELECT * from users;`;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
