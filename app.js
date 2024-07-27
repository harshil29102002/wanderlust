if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// router
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");
const dbUrl = process.env.ATLASDB_URL;
const flash = require("connect-flash");

Main()
  .then((res) => {
    console.log("welcome to MonGo world");
  })
  .catch((err) => {
    console.log(err);
  });

async function Main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time period in seconds
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION ",err)
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currusr = req.user;
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", review);
app.use("/", user);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page is not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went Wrong" } = err;
  res.status(statusCode).render("./Error/error.ejs", { message });
});

app.listen("8080", () => {
  console.log("port is listening on server 8080");
});
