const { Query } = require("mongoose");
const Listing = require("../models/listing");
const USD_TO_INR = 83.2; // or fetch from API or config
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { allListings: listings });
};

module.exports.new = (req, res) => {
  res.render("listings/new");
};


module.exports.show =async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" }
    });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const priceINR = Math.round(listing.price * USD_TO_INR);
  res.render("listings/show", { listing, priceINR });
};

module.exports.create = async (req, res,next) => {
let response = await geocodingClient
.forwardGeocode({
  query : req.body.listing.location,
  limit:1,
})
.send();
  let filename= req.file.filename;
  let url= req.file.path;

  if (!req.body.listing) {
    throw new ExpressError("Missing listing data", 400);
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; 
  newListing.image ={url,filename};

  newListing.geometry = response.body.features[0].geometry;
 let savedlisting =  await newListing.save();
 console.log(savedlisting);

  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you are trying to edit does not exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;

  // ✅ Safe transformation only if it's a Cloudinary URL
  if (originalImageUrl && originalImageUrl.includes("/upload/")) {
    originalImageUrl = originalImageUrl.replace(
      "/upload/",
      "/upload/h_300,w_250,ar_1.0,c_thumb,g_face/r_max/co_skyblue,e_outline/co_lightgray,e_shadow,x_5,y_8/"
    );
  }


  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.update = async (req, res) => {
  const { id } = req.params;

  if (!req.body.listing) {
    throw new ExpressError("Missing listing data", 400);
  }

  // ✅ Update listing fields
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    runValidators: true,
    new: true
  });

  // ✅ Update image if a new file was uploaded
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${updatedListing._id}`);
};

module.exports.view=async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { allListings: listings });
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};