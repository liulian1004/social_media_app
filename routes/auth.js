const express = require("express");
const router = express.Router();
const authHelper = require("../helper/auth");
const passport = require("passport");
const flash = require("connect-flash");

//login
router.get("/login", (req, res, next) => {
  const messages = req.flash();
  res.render("login", { messages });
});

//wrong pw or username
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "The username or password is wrong, please try again!!!! ",
  }),
  (req, res, next) => {
    res.redirect("/users");
  }
);

//register
router.get("/register", (req, res, next) => {
  const messages = req.flash();
  res.render("register", { messages });
});

//send the register info
//encode the pw
router.post("/register", (req, res, next) => {
  const parms = req.body;
  const users = req.app.locals.users;
  const payload = {
    username: parms.username,
    password: authHelper.encodePW(parms.password),
  };
  users.insertOne(payload, (err) => {
    if (err) {
      req.flash("error", "User account has already existed");
    } else {
      req.flash("success", "You registered successfully!!!");
    }
    res.redirect("/");
  });
});

//logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
