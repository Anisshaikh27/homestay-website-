// router for listing
const express = require('express');
const router = express.Router();

// // importing models
const Listing = require('../models/listing');

// import wrapAsync function for try-catch alternative
const wrapAsync = require('../utils/wrapAsyncFunction');

// importing ExpressError class for custom error handling
const ExpressError = require('../utils/ExpressError');

// importing listingschemavalidation object of joi for schema validation on server side
const { listingSchemaValidation }  = require('../utils/schemavalidation'); 

// validation middlewares
    //for listing schema 
const validateListingSchema = (req,res,next)=> {
    const { error, value } = listingSchemaValidation.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    }else{
        next();
    }
}

const {isLoggedIn,isOwner} = require('../utils/authMiddlewares');
const { getAllListings,getListingDetails, getEditForm, updateListingDetails, getAddNewListingForm, AddNewListing , deleteListing } = require('../controllers/listing');


// Routing
// for home page
router.get(['/'], wrapAsync(getAllListings));

// for specific details page 
// http://localhost:8080/home/details/6791f35ded139052510d6192
router.get('/details/:id', wrapAsync(getListingDetails));

// for edit details 
router.get('/edit/:id',isLoggedIn,isOwner,wrapAsync(getEditForm));


// now updating the details
router.post('/edit/:id',isLoggedIn,isOwner,validateListingSchema, wrapAsync(updateListingDetails));


// for adding new data 
router.get('/add',isLoggedIn, wrapAsync(getAddNewListingForm));
router.post('/add',validateListingSchema, wrapAsync(AddNewListing));


// for deleting data 
//Delete Route (admin only functionality)
router.get('/delete/:id',isLoggedIn,isOwner, wrapAsync(deleteListing));

module.exports =  router;