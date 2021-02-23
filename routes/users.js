var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const flash = require("connect-flash");

//get own proflie
router.get("/", function (req, res) {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }
  const users = req.app.locals.users;
  //the method to transfer to the id format in the db
  const _id = ObjectID(req.session.passport.user);

  users.findOne({ _id }, (error, result) => {
    if (error) {
      throw error;
    }
    res.render("account", { ...result });
  });
});

//check profile with username
router.get("/:username", (req, res) => {
  const users = req.app.locals.users;
  const username = req.params.username;

  users.findOne({ username }, (error, result) => {
    if (error || !result) {
      res.render("profile", { messages: { error: ["users not found"] } });
    }
    res.format({
      //json
      "application/json": () => {
        res.json(result);
      },
      //html
      "text/html": () => {
        res.render("profile", { ...result, username });
      },
    });
  });
});

//update user profile
router.post("/", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }

  const users = req.app.locals.users;
  const { name, instagram, twitter, message } = req.body;
  const _id = ObjectID(req.session.passport.user);

  users.updateOne(
    { _id },
    { $set: { name, instagram, twitter, message } },
    (err) => {
      if (err) {
        throw err;
      }
      res.redirect("/users");
    }
  );
});

module.exports = router;
