const { set } = require("mongoose");
const User = require("../models/User");
const jswt = require("jsonwebtoken");
const handleError = (error) => {
  let errors = { email: "", password: "" };
  if (error.message === "incorrect email") {
    errors.email = "That email is not registered, Sign up first";
    return errors;
  }
  if (error.message === "incorrect password") {
    errors.password = "That password is incorrect";
    return errors;
  }
  if (error.code === 11000) {
    errors.email = "Email already exists";
    return errors;
  }
  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id) => {
  return jswt.sign({ id }, "elvo", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};
module.exports.login_get = (req, res) => {
  res.render("login", { title: "Login" });
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleError(error);
    res.status(400).json({ errors });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user }); // Return user ID or any other user info as needed
  } catch (error) {
    const errors = handleError(error);
    console.log("haapaaa kuna taabu==", errors);
    res.status(400).json({ errors });
  }
  // res.status(200).json({ email: email, password: password });
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};
module.exports.redirectSignin = (req, res, next) => {
  setTimeout(() => {
    res.redirect("/signup");
  }, 2000); // Redirect after 2 seconds
  next();
};
