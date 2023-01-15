const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Dummy Text
let topBooks = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
  },
  {
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
  },
  {
    title: "Twilight",
    author: "Stephanie Meyer",
  },
];

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

// App
const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(myLogger);
app.use(requestTime);

// ======================
// === CRUD - CREATE
// ======================

// ======================
// === CRUD - READ
// ======================
app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/books", (req, res) => {
  res.json(topBooks);
});

// ======================
// === CRUD - UPDATE
// ======================

// ======================
// === CRUD - DELETE
// ======================

// ======================
// === Server Port
// ======================
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
