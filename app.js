if(process.env.NODE_ENV !== "production") {
require("dotenv").config() 
};


const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Models and Routes
const User = require("./models/user");
const Listing = require("./models/listing");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Middleware
const wrapAsync = require("./utils/wrapAsync");

const app = express();

// EJS setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session config
const MongoStore = require("connect-mongo");

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL || "mongodb://127.0.0.1:27017/wanderlust",
    touchAfter: 24 * 3600 // time in seconds
  }),
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true only in production
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

// Connect to MongoDB
mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global locals middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Home route
app.get("/", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("home", { listings });
}));

// Demo user creation route (remove or protect in production)
app.get("/DemoUser", async (req, res) => {
  const fakeUser = new User({
    username: "NewUser",
    email: "student123@gmail.com"
  });
  const registeredUser = await User.register(fakeUser, "password");
  res.send(registeredUser);
});

// ✅ Correct Route Mounting
app.use("/listings", listingsRouter);                 // e.g., /listings, /listings/:id,...
app.use("/listings/:id/reviews", reviewsRouter);      // ✅ reviews mounted at /listings/:id/reviews
app.use("/", userRouter);                             // Login, register, etc.

// Catch-all route (404)
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000 ;
// Start server
app.listen(port, () => {
  console.log("🌐 Server is running on port 3000");
});