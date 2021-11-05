const express = require("express");
const apiRouter = require("./routes/api.routes");
const { handle400, handle500 } = require("./controllers/error.controller");
const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.use(handle400);
app.use(handle500);
app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid route" });
});

module.exports = app;
