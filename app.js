const express = require("express");
const apiRouter = require("./routes/api.routes");
const {
  handle500,

  badRequests,
} = require("./controllers/error.controller");
const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.use(badRequests);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid route" });
});
app.use(handle500);
module.exports = app;
