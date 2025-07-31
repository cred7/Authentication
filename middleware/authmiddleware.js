const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if token exists
  if (token) {
    jwt.verify(token, "elvo", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checker = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if token exists
  if (token) {
    jwt.verify(token, "elvo", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null; // No user found
        next();
      } else {
        console.log(decodedToken);
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null; // No user found
    next();
  }
};

const redirectSignin = (req, res, next) => {
  setTimeout(() => {
    res.redirect("/signup");
  }, 2000); // Redirect after 2 seconds
  next();
};
module.exports = { requireAuth, checker, requireAuths, redirectSignin };
