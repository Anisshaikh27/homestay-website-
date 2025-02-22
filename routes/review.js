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
const { addNewReview, deleteReview } = require('../controllers/review');

// post request on review form submission

router.post('/reviews',isLoggedIn,validateReviewSchema,wrapAsync(addNewReview));

router.get('/reviews/:reviewId/delete',isLoggedIn,isReviewAuthor,wrapAsync(deleteReview));

module.exports = router;