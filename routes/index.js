var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const users = req.app.locals.users;
  //limit to 10
  users.find().toArray((err, list) => {
    res.render("index", {
      list,
    });
  });
});

module.exports = router;
