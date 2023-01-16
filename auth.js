const jwtSecret = "69e6b21af9ea8c5eabb8";

const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport");

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        console.error(error);
        return res.status(400).json({
          message: "Username or password is not correct.",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
