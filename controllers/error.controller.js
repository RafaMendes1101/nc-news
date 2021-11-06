exports.badRequests = (err, req, res, next) => {
  const param = Object.keys(req.query);
  const value = Object.values(req.query);
  if (err) {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid request." });
    } else if (err.code === "42703") {
      res.status(400).send({ msg: `Invalid ${param[0]} value ${value[0]}` });
    } else if (err.code === "42601") {
      res.status(400).send({ msg: `Invalid ${param[0]} value ${value[0]}` });
    } else if (err.code === "23503") {
      res.status(404).send({ msg: "Article not found." });
    } else {
      res.status(404).send({ msg: err.msg });
    }
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
