//router for reviews
const express = require('express');
const router = express.Router({mergeParams: true});

// importing models
const Review = require('../models/review');
const Listing = require('../models/listing');


const  wrapAsync = require('../utils/wrapAsyncFunction');

const ExpressError = require('../utils/ExpressError');

// importing Reviewschemavalidation object of joi for schema validation on server side 
const {reviewsSchemavalidation }= require('../utils/schemavalidation');

//validation middleware 
    //for review schema
const validateReviewSchema = (req,res,next)=>{
    // console.log(req.body);
    const body = req.body.reviewText;
    const rating = req.body.reviewRating;

    const { error, value } = reviewsSchemavalidation.validate({body,rating});
    if (error) {
        throw new ExpressError(400, error.message);
    }else{
        next();
    }
}

const {isLoggedIn,isReviewAuthor} = require('../utils/authMiddlewares');

// post request on review form submission

router.post('/reviews',isLoggedIn,validateReviewSchema,wrapAsync(async (req, res) => {
    if (!req.params.id) {
        throw new ExpressError(404, 'Listing not found ,bad request');
    }
    // console.log(req.body);
    let id = req.params.id;
    let {reviewRating,reviewText} = req.body;

    let newReview = new Review({body:reviewText,rating:reviewRating,author:req.user._id});
    await newReview.save();
    await Listing.findByIdAndUpdate(id,{$push:{reviews:newReview._id}});
    req.flash('success', 'Review added successfully');
    res.redirect(`/home/details/${id}`);

}));

router.get('/reviews/:reviewId/delete',isLoggedIn,isReviewAuthor,wrapAsync(async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/home/details/${id}`);
}));

module.exports = router;