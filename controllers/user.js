const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.postSignup = (req, res, next) => {
  bcrypt.hash(req.body.password, 12).then((hash) => {
    const user = new User({ email: req.body.email, password: hash });
    user
      .save()
      .then((user) => {
        res.status(201).json({ message: "User created!", user });
      })
      .catch(() => {
        res.status(500).json({ message: 'Invalid auth credentials!' });
      });
  });
}

exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Can not find a user." });
      }

      bcrypt.compare(req.body.password, user.password).then((isValid) => {
        if (isValid) {
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          res.status(200).json({ token, expiresIn: 3600, userId: user._id });
        } else {
          res.status(401).json({ message: "Can not find a user." });
        }
      });
    })
    .catch(() => {
      res.status(401).json({ message: "Can not find a user." });
    });
}
