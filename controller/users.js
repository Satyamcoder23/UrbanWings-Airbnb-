const User = require("../models/user");
module.exports.rendersignup= (req, res) => {
  res.render("users/signup", { title: "Sign Up" });
};

module.exports.signup =async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err); // ✅ Correct use of next
      req.flash("success", "Welcome to the platform!");
      res.redirect("/listings");
    });
  } catch (error) {
    console.error("Signup error:", error);

    let message = "Signup failed. Please try again.";
    if (error.name === "UserExistsError") {
      message = "Username is already taken.";
    } else if (error.name === "ValidationError") {
      message = "Invalid input. Please check all fields.";
    }

    req.flash("error", message);
    res.redirect("/signup");
  }};

  module.exports.renderlogin =(req, res) => {
  res.render("users/login", { title: "Login" });
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};