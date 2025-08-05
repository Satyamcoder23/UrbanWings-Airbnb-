const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review'); // Correct import

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  country: String,
  location: String,
  image: {
    filename: String,
    url: String
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  
  }
});

// ✅ Middleware to delete associated reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(`🧹 Deleted ${listing.reviews.length} reviews for listing "${listing.title}"`);
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;








