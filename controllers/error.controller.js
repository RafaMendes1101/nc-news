exports.handle400 = (err, req, res, next) => {
  if (err) {
    res.status(400).send({ msg: "Article not found" });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
