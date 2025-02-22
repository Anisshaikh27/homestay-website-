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


// Routing
// for home page
router.get(['/'], wrapAsync( async (req, res) => {
    // res.send('add page');
    
    const listings = await Listing.find({});
    res.render('./listings/home', { listings });
}));


// for specific details page 
// http://localhost:8080/home/details/6791f35ded139052510d6192
router.get('/details/:id', wrapAsync(async (req, res) => {
    if (!req.params.id) {
        throw new ExpressError(404, 'Listing not found ,bad request');
    }
    let id = req.params.id; 
    // console.log(id);
    let result = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner'); //populate methods retrives data from reviews collection based on object id 
    // console.log(result);
    if (!result){
        req.flash('error','listing not found ')
        res.redirect('/home');
    }
    else{
        res.render('./listings/details', { result });
    }
}));

// for edit details 

router.get('/edit/:id',isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    if (!req.params.id) {
        throw new ExpressError(404, 'Listing not found ,bad request');
    }
    let id = req.params.id;
    let result = await Listing.findById(id);
    // console.log(result);  
    if (!result){
        req.flash('error','listing not found ')
        res.redirect('/home');
    }
    else{
        res.render('./listings/editdetails', {result});
    }


}));


// now updating the details

router.post('/edit/:id',isLoggedIn,isOwner,validateListingSchema, wrapAsync(async(req,res)=>{

        // console.log(req.body);
        let {title,description,price,location,country} = req.body;
        
        await Listing.findByIdAndUpdate(req.params.id,{title:title,description:description,price:price,location:location,country:country},{runValidators:true}); 
        req.flash('success', 'Listing updated successfully');
        res.redirect('/home');
}));


// for adding new data 

router.get('/add',isLoggedIn, wrapAsync((req, res) => {
        res.render('./listings/add');

}));

router.post('/add',validateListingSchema, wrapAsync( async (req, res) => {

    // console.log(req.body);
    // console.log(listingSchemaValidation);

    let { title, description, image, price, location, country } = req.body;
    let newListing = new Listing({ title, description, image: { url: image }, price, location, country, owner: req.user._id });  
    await newListing.save();
    req.flash('success', 'Listing added successfully');
    res.redirect('/home');

}));

// for deleting data 
//Delete Route (admin only functionality)

router.get('/delete/:id',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    if (!req.params.id) {
        throw new ExpressError(404, 'Listing not found ,bad request');
    }
    const listingId = req.params.id;
    let result = await Listing.findByIdAndDelete(listingId);
    //mongoose query middleware gets automatically triggered now
    if (!result){
        req.flash('error','listing not found ')
        res.redirect('/home');
    }
    else{
        req.flash('success', 'Listing deleted successfully');
        res.redirect('/home');   
    }
    
}));


module.exports =  router;