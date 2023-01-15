require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const models = require("./models.js");
const passportJWT = require("passport-jwt");

let users = models.user;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, callback) => {
      console.log(username + " " + password);
      users.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log(err);
          return callback(err);
        }

        if (!user) {
          console.log("Incorrect username");
          return callback(null, false, {
            message: "Incorrectt username!",
          });
        }

        if (!user.validatePassword(passport)) {
          console.log("Incorrect password");
          return callback(null, false, { message: "Incorrect password!" });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "69e6b21af9ea8c5eabb8",
    },
    (jwtPayload, callback) => {
      return users
        .findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);
