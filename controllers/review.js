const Review = require('../models/review');
const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');

module.exports.addNewReview = async (req, res) => {
    if (!req.params.id) {
        throw new ExpressError(404, 'Listing not found ,bad request');
    }
    console.log(req.body);
    let id = req.params.id;
    let {reviewRating,reviewText} = req.body;

    let newReview = new Review({body:reviewText,rating:reviewRating,author:req.user._id});
    await newReview.save();
    await Listing.findByIdAndUpdate(id,{$push:{reviews:newReview._id}});
    req.flash('success', 'Review added successfully');
    res.redirect(`/home/details/${id}`);

}

module.exports.deleteReview = async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/home/details/${id}`);
}

