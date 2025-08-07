const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocalMongoose); // Adds username and password fields, and handles hashing 
module.exports = mongoose.model("User", userSchema);


const Listing = require("./listing");

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Listing.deleteMany({ author: doc._id });
    console.log(`🧹 Listings by ${doc._id} deleted`);
  }
});