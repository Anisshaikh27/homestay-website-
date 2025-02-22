const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    },

    createdAt: {type: Date, default: Date.now}
   
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;