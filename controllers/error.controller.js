exports.handle400 = (err, req, res, next) => {
  if (err) {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid query." });
    } else {
      res.status(400).send({ msg: err.msg });
    }
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
