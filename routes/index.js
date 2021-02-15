var express = require("express");
var router = express.Router();

//render the user list
router.get("/", function (req, res, next) {
  const users = req.app.locals.users;
  //limit to 10
  users.find().toArray((err, list) => {
    res.render("index", {
      list,
    });
  });
});

// const users = require("./users");
// const deleteUser = users.de;
module.exports = router;
