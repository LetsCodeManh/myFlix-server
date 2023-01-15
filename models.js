require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("strictQuery", true);

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
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

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

let movie = mongoose.model("movie", movieSchema);
let user = mongoose.model("user", userSchema);

module.exports.movie = movie;
module.exports.user = user;
