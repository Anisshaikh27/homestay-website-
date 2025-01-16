const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
      filename: String,
      url: String
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;

