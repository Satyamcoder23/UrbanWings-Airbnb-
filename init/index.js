require('dotenv').config();
const mongoose = require('mongoose');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Listing = require('../models/listing.js');
const User = require('../models/user.js');
const sampleListings = require('./data.js');

const geocoder = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

// ✅ Use the same DB as your app
const MONGO_URL = process.env.DB_URL;

main().then(() => {
  console.log("✅ Connected to MongoDB");
  console.log("📦 Seeding into DB:", mongoose.connection.name);
}).catch(err => console.error("❌ MongoDB connection error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("🧹 Old listings deleted");

  let user = await User.findOne({ username: 'Satyam' });

  if (!user) {
    user = new User({
      username: 'Satyam',
      email: 'satyam@example.com',
    });
    await user.save();
    console.log("👤 New user created:", user._id);
  } else {
    console.log("👤 Using existing user:", user._id);
  }

  const listingsWithOwnerAndGeometry = [];

  for (let obj of sampleListings) {
    const fullLocation = `${obj.location}, ${obj.country}`;
    const geoData = await geocoder.forwardGeocode({
      query: fullLocation,
      limit: 1
    }).send();

    const geometry = geoData.body.features[0]?.geometry;

    if (!geometry) {
      console.warn(`⚠️ No geometry found for ${fullLocation}`);
      continue;
    }

    listingsWithOwnerAndGeometry.push({
      ...obj,
      owner: user._id,
      geometry
    });
  }

  await Listing.insertMany(listingsWithOwnerAndGeometry);
  console.log(`📦 Inserted ${listingsWithOwnerAndGeometry.length} listings with geometry`);

  mongoose.connection.close();
};

initDB();