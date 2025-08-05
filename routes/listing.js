const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // Cloudinary or local storage

const listingController = require("../controller/listing");

// Currency conversion constant
const USD_TO_INR = 83;

// ✅ Index Route — View all listings, Create new listing
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('image'), // ✅ Flat field name
    (req, res, next) => {
      if (req.file) {
        req.body.listing.image = {
          url: req.file.path,         // or req.file.url if using Cloudinary
          filename: req.file.filename
        };
      }
      next();
    },
    validateListing,
    wrapAsync(listingController.create)
  );

// ✅ Show form to create a new listing
router.get("/new", isLoggedIn, listingController.new);

// ✅ Show, Update, Delete a single listing
router.route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('image'), // ✅ Flat field name
    (req, res, next) => {
      if (req.file) {
        req.body.listing.image = {
          url: req.file.path,         // or req.file.url
          filename: req.file.filename
        };
      }
      next();
    },
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

// ✅ Edit Listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;