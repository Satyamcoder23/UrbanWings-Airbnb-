const Joi = require("joi");

// ✅ Listing Schema
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),

    // ✅ Make image optional
    image: Joi.object({
      filename: Joi.string().optional().allow('', null),
      url: Joi.string().uri().required()
    }).optional() // ✅ This allows updates without image
  }).required()
});

// ✅ Review Schema — simplified to match req.body.review
module.exports.reviewSchema = Joi.object({
  comment: Joi.string().max(500).required(),
  rating: Joi.number().min(1).max(5).required(),
  createdAt: Joi.date().default(Date.now)
});