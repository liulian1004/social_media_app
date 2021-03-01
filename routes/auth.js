const express = require("express");
const router = express.Router();
const authHelper = require("../helper/encode");
const passport = require("passport");
//const flash = require("connect-flash");

//open login page
router.get("/login", (req, res) => {
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
  (req, res) => {
    res.redirect("/users");
  }
);

//register
router.get("/register", (req, res, next) => {
  const messages = req.flash();
  res.render("register", { messages });
});

//send the register info to db
// valid the input
//encode the pw
router.post("/register", (req, res, next) => {
  const parms = req.body;
  const users = req.app.locals.users;
  const username = parms.username;
  const pw = parms.password;
  //corner hanlding
  if (username === "" || pw === "") {
    req.flash("error", "Please fill in the username or password");
    res.redirect("/auth/register");
  } else {
    const payload = {
      username: parms.username,
      password: authHelper.encodePW(parms.password),
    };
    users.insertOne(payload, (err) => {
      if (err) {
        req.flash("error", "Somethings goes wrong, please try again");
      } else {
        req.flash("success", "You registered successfully!!!");
      }
      res.redirect("/auth/register");
    });
  }
});

//logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
