const Listing = require("./models/listing");
const Review = require("./models/review"); // ✅ Import the Review model
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schemas.js");

// ✅ Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    // Extract listing ID from the URL if it's a review route
    let redirectPath = req.originalUrl.split("?")[0];

    // If it's a review route, redirect to the listing instead
    const reviewRouteMatch = redirectPath.match(/^\/listings\/([^\/]+)\/reviews\/[^\/]+$/);
    if (reviewRouteMatch) {
      const listingId = reviewRouteMatch[1];
      redirectPath = `/listings/${listingId}`;
    }

    req.session.redirectUrl = redirectPath;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

// ✅ Save redirect URL for post-login navigation
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

// ✅ Check if current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  if (!req.user || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this listing.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// ✅ Check if current user is the owner of the review
module.exports.isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const foundReview = await Review.findById(reviewId); // ✅ Use Review model

  if (!foundReview) {
    req.flash("error", "Review not found.");
    return res.redirect(`/listings/${id}`);
  }

  if (!foundReview.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You do not have permission to edit this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// ✅ Validate listing data using Joi
module.exports.validateListing = (req, res, next) => {
  if (!req.body || !req.body.listing) {
    throw new ExpressError("Listing data is missing.", 400);
  }

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};

// ✅ Validate review data using Joi
module.exports.validateReview = (req, res, next) => {
  if (!req.body || !req.body.review) {
    throw new ExpressError("Review data is missing.", 400);
  }

  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }

  next();
};