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
      users.findOne({ username }, (err, user) => {
        if (err) {
          return callback(err);
        }

        if (!user) {
          return callback(null, false, {
            message: "Incorrect username!",
          });
        }

        user
          .validatePassword(passport)
          .then((isValid) => {
            if (!isValid) {
              return callback(null, false, { message: "Incorrect password" });
            }
            return callback(null, user);
          })
          .catch(callback);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
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
