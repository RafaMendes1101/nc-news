const db = require("../connection.js");
const format = require("pg-format");
const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return db.query(
        `CREATE TABLE topics (
          slug VARCHAR(25) PRIMARY KEY UNIQUE NOT NULL,
          description VARCHAR(100) NOT NULL
          );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users (
          username VARCHAR PRIMARY KEY UNIQUE,
          avatar_url VARCHAR NOT NULL,
          name VARCHAR NOT NULL
          );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          body VARCHAR NOT NULL,
          votes INT DEFAULT 0,
          topic VARCHAR REFERENCES topics(slug) NOT NULL,
          author VARCHAR REFERENCES users(username),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
          );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY,
            author VARCHAR REFERENCES users(username) NOT NULL,
            article_id INT REFERENCES articles(article_id) NOT NULL,
            votes INT DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            body VARCHAR NOT NULL
            );`
      );
      // 2. insert data
    })
    .then(() => {
      const insertUserQuery = format(
        `INSERT INTO users(username,avatar_url,name) VALUES %L RETURNING*;`,
        userData.map((user) => {
          return [user.username, user.avatar_url, user.name];
        })
      );
      return db.query(insertUserQuery);
    })
    .then(() => {
      const insertTopicsQuery = format(
        `INSERT INTO topics(slug,description) VALUES %L RETURNING*;`,
        topicData.map((topic) => {
          return [topic.slug, topic.description];
        })
      );
      return db.query(insertTopicsQuery);
    })
    .then(() => {
      const insertArticlesQuery = format(
        `INSERT INTO articles(title,topic,body,author,created_at,votes) VALUES %L RETURNING*;`,
        articleData.map((article) => {
          return [
            article.title,
            article.topic,
            article.body,
            article.author,
            article.created_at,
            article.votes,
          ];
        })
      );
      return db.query(insertArticlesQuery);
    })
    .then(() => {
      const insertCommentsQuery = format(
        `INSERT INTO comments(author,article_id,votes,body,created_at) VALUES %L RETURNING*;`,
        commentData.map((comment) => {
          return [
            comment.author,
            comment.article_id,
            comment.votes,
            comment.body,
            comment.created_at,
          ];
        })
      );
      return db.query(insertCommentsQuery);
    });
};

module.exports = seed;
