const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
  }],
  director: {
    name: { type: String, required: true },
    bio: { type: String, required: true },
  },
  actors: [String],
  imagePath: String,
  featured: Boolean,
});

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "movie" }],
});

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = async function (password) {
  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }
  return await bcrypt.compare(password, this.password);
};

let movie = mongoose.model("movie", movieSchema);
let user = mongoose.model("user", userSchema);

module.exports.movie = movie;
module.exports.user = user;
