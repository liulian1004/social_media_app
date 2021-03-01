var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

//import libary
const hbs = require("hbs");
const dbClient = require("mongodb").MongoClient;
const passport = require("passport"); //authentication middleware
const Strategy = require("passport-local").Strategy; //for authenticating with a username and password.
const session = require("express-session"); //session middleware
const flash = require("connect-flash"); //a special area of the session used for storing messages.
//helper method
const auth = require("./helper/encode"); // the method of encoding pw

//import path
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var deleteRouter = require("./routes/delete");

var app = express();

//init db at localhost
dbClient.connect(
  "mongodb://localhost:27017",
  { useUnifiedTopology: true },
  (error, result) => {
    if (error) {
      throw error;
    }
    const db = result.db("user-proflies");
    const users = db.collection("users");
    app.locals.users = users;
  }
);

//app.use: using express middleware
//init the middleware and setting up
// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//password
passport.use(
  new Strategy((username, password, done) => {
    app.locals.users.findOne({ username }, (error, result) => {
      if (error) {
        return done(error);
      }
      // did not find user or password doesn't match
      // need to encode the input password
      if (!result || result.password != auth.encodePW(password)) {
        return done(null, false);
      }
      return done(null, result);
    });
  })
);

// In order to support login sessions
//Passport will serialize and deserialize user instances to and from the session.
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  done(null, { id });
});

//store session
app.use(
  session({
    secret: "session secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  next();
});

//flash message
app.use(flash());

//create the router
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/delete", deleteRouter);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
