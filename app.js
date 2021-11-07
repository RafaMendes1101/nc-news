const express = require("express");
const apiRouter = require("./routes/api.routes");
const commentsRouter = require("./routes/comments.routes");
const articlesRouter = require("./routes/articles.routes");
const usersRouter = require("./routes/users.routes");
const { handle500, badRequests } = require("./controllers/error.controller");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);
app.use(badRequests);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid route" });
});
app.use(handle500);
module.exports = app;
