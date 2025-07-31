const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "provide an email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, "password needed"],
    minlength: [6, "a minimum of 6 letter password needed"],
    validate: {
      validator: (v) => {
        return /^(?=.*[A-Z]).{6,}$/.test(v);
      },
      message: (props) =>
        "Password must be at least 6 characters long and contain at least one uppercase letter.",
    },
  },
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  console.log("User is about to be saved:", this);
  next();
});
// userSchema.post("save", function (doc, next) {
//   console.log("New user created and saved:", doc);
//   next();
// });

//
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    console.log("User found:");
    console.log(user);
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      console.log("Password matched");
      return user;
    }
    throw Error("incorrect password");
  }

  throw Error("incorrect email");
};
const User = mongoose.model("user", userSchema);

module.exports = User;
