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
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] 
});

// Mongoose middleware: after a listing is deleted, delete its associated reviews.
// Note: Do not try to call Express response methods (like res.redirect) here.
// Note: should be defined before mongoose model compilation
listingSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
      // Delete all reviews whose _id is in the doc.reviews array.
      await mongoose.model('Review').deleteMany({ _id: { $in: doc.reviews } });
      console.log('Associated reviews deleted successfully.');
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;

