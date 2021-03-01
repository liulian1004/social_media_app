var express = require("express");
var router = express.Router();

//render the user list
router.get("/", function (req, res, next) {
  const users = req.app.locals.users;
  //render the user who leave the message
  users.find().toArray((err, list) => {
    res.render("index", {
      list,
    });
  });
});

module.exports = router;
