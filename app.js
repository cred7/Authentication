const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const { data, homes } = require("./data.js");
const cookieParser = require("cookie-parser");
const { requireAuth, checker } = require("./middleware/authmiddleware.js");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

//view engine setup
app.set("view engine", "ejs");

// Connect to MongoDB
const dbURI =
  "mongodb+srv://codeinnode:QWERTY1234@learnnode.qqqrw4y.mongodb.net/node-auth?retryWrites=true&w=majority&appName=learnnode";
mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
      console.log("Connected to MongoDB");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
app.use(checker);
// Routes
app.use(authRoutes);

app.get("/", requireAuth, (req, res) => {
  res.render("home", { title: homes[0].title, data: data });
});
app.get("/about", requireAuth, (req, res) => {
  res.render("smoothies", { title: homes[1].title });
});
