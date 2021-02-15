var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const passport = require("passport");
const flash = require("connect-flash");

//delete account
router.get("/:username", function (req, res, next) {
  const users = req.app.locals.users;
  const username = req.params.username;

  users.findOne({ username }, (error, result) => {
    if (error || !result) {
      req.render("profile", { messages: { error: ["users not found"] } });
      res.redirect("/delete");
    }
    //console.log(result);
    users.deleteOne({ username }, (err) => {
      if (err) {
        res.redirect("/error", { messages: "users not found" });
      }
      res.redirect("/");
    });
  });
});

module.exports = router;
