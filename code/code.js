// code change 1
const requireAuths = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if token exists
  if (token) {
    jwt.verify(token, "elvo", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/login");
  }
};
