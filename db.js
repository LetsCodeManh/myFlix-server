require("dotenv").config()
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_URI_str = MONGODB_URI.toString();

const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI_str, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

module.exports = { connectDb };