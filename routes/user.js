const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/users");
const user = require("../models/user");

// 📝 Signup form
router.route("/signup")
.get(userController.rendersignup)
.post(userController.signup);

// 🔐 Login form
router.route("/login")
.get(userController.renderlogin)
.post(saveRedirectUrl,
  passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,
  }), userController.login
);

// 🚪 Logout
router.get("/logout", userController.logout);

module.exports = router;