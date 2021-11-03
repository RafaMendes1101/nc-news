const { fetchUsers, fetchUserByUsername } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  fetchUserByUsername(req.params.username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
