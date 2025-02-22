//check if logged in middleware 
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    let pucchi = req.originalUrl;

    // Check if req.user exists before attempting to set properties
    if (req.user) { // This condition is crucial
        req.user.lastRequestedUrl = pucchi;
        console.log("Pucchi stored in req.user:", pucchi);
    } else {
        // If req.user is undefined, it means the user is not logged in.
        // You can store the pucchi in the session here, but it will be lost after the authentication process.
        // The best approach is to store it in session before authentication, then retrieve it after authentication.
        req.session.pucchiBeforeAuth = pucchi; // Store in session BEFORE authentication
    }

    req.flash('error', 'Please login first');
    res.redirect('/auth/login');
};

const Listing = require('../models/listing');
const isOwner = async (req, res, next) => {
    
    const listing = await Listing.findById(req.params.id);
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit/delete this listing.');
        return res.redirect('/home');
    }
    next();
}

const Review = require('../models/review');
const isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review.author._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit/delete this review.');
        return res.redirect(`/home/details/${req.params.id}`);
    }
    next();
}

module.exports = { isLoggedIn, isOwner, isReviewAuthor};