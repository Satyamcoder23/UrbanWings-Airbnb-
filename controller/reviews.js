const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");

// Create a new review
module.exports.createreviewpost=async (req, res, next) => {
  console.log("🧾 Review req.body:", req.body);

  if (!req.body.review) {
    throw new ExpressError("Review data is missing.", 400);
  }

  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }

  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError("Listing not found", 404);

  const newReview = new Review({
    rating: Number(req.body.review.rating),
    comment: req.body.review.comment,
    author: req.user._id
  });

  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();

  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
};


// Delete review
module.exports.deletereviewpost = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};