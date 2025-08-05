const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");
const { reviewSchema } = require("../schemas");
const { isReviewOwner } = require("../middleware");
const reviewsController = require("../controller/reviews");



// ✅ POST /listings/:id/reviews
router.post("/", isLoggedIn, wrapAsync(reviewsController.createreviewpost));

// ✅ DELETE /listings/:id/reviews/:reviewId
router.delete("/:reviewId", isLoggedIn,isReviewOwner, wrapAsync(reviewsController.deletereviewpost));

module.exports = router;