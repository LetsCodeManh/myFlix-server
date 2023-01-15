const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

// ======================
// === Import Schema
// ======================
const models = require("./models.js");
const movies = models.movie;
const users = models.user;

// ======================
// === App
// ======================
const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// ======================
// === Timestamp
// ======================
let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(morgan("combined", { stream: accessLogStream }));
app.use(myLogger);
app.use(requestTime);

// ======================
// === Middlewares
// ======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

// If the cors needs to be specific
// let allowedOrigins = ["http://localhost:8080", "http://localhost:1234"]

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         let message =
//           "The CORS policy for this application doesn't allow access from origin " +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.use(express.static("public"));

// ======================
// === Error Handling
// ======================
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Error: " + err.stack);
});

// ======================
// === CRUD - CREATE
// ======================
app.post("/users", (req, res) => {
  users
    .findOne({ username: req.params.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + " alrady exists");
      } else {
        users
          .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday,
          })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error: " + err);
    });
});

app.post("/users/:username/movies/:movieId", (req, res) => {
  users
    .findOneAndUpdate(
      { username: req.params.username },
      { $push: { favoriteMovies: req.params.movieId } },
      { mew: true }
    )
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error: " + err);
    });
});

// ======================
// === CRUD - READ
// ======================
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .findOne({ title: req.params.title })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .findOne({ "genre.name": req.params.genreName })
      .then((movie) => {
        res.status(201).json(movie.genre);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/movies/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .findOne({ "director.name": req.params.directorName })
      .then((movie) => {
        res.status(201).json(movie.director);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOne({ username: req.params.username })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// ======================
// === CRUD - UPDATE
// ======================
app.put(
  "user/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOneAndUpdate(
        { username: req.params.username },
        {
          $set: {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday,
          },
        },
        { new: true }
      )
      .then((user) => {
        res.status(200).json(user);
      })
      .catcj((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// ======================
// === CRUD - DELETE
// ======================
app.delete(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOneAndRemove({ username: req.params.username })
      .then((user) => {
        res.status(200).json(req.params.username + " was deleted!");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.delete(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOneAndUpdate(
        { username: req.params.username },
        { $pull: { favoriteMovies: req.params.movieId } },
        { new: true }
      )
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// ======================
// === Static
// ======================
app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// ======================
// === Server Port
// ======================
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
