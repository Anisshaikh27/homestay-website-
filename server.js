const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');



// connecting to db
const { connectDB, deleteData, insertdata } = require('./init/connectDB');

// Connect to DB and initialize data
(async () => {
    await connectDB();
    // await deleteData();
    await insertdata();
})();

// importing models
const Listing = require('./models/listing');
const Review = require('./models/reviews'); 

// import wrapAsync function
const wrapAsync = require('./utils/wrapAsyncFunction');

// importing ExpressError class for custom error handling
const ExpressError = require('./utils/ExpressError');

// importing listingschemavalidation object of joi for schema validation on server side
const listingSchemaValidation  = require('./schemavalidation'); 
// importing reviewsSchemavalidation object of joi for schema validation on server side
const reviewsSchemavalidation = require('./schemavalidation');


// middlewares
// ORDER MATTERSS IN MIDDLEWARE
// // requiring  ejs mate engine
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

// setting view engine and path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// serving static files
app.use(express.static(path.join(__dirname, 'public')));


// to get req res params 
app.use(express.urlencoded({ extended: true }));

// validation middlewares
    //for listing schema 
const schemavalidation = (req,res,next)=>{
    const { error, value } = listingSchemaValidation.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    }else{
        next();
    }
}

    //for review schema
const reviewschemavalidation = (req,res,next)=>{
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

// Routing

// for home page
app.get(['/home' , '/'], wrapAsync( async (req, res) => {
    
        const listings = await Listing.find({});
        res.render('./listings/home', { listings });
}));


// for specific details page 
// http://localhost:8080/home/details/6791f35ded139052510d6192
app.get('/home/details/:id', wrapAsync(async (req, res) => {
    if (!req.params.id) {
        throw new ExpressError(404, 'Listing not found ,bad request');
    }
    let id = req.params.id; 
    // console.log(id);
    let result = await Listing.findById(id).populate('reviews'); //populate methods retrives data from reviews collection based on object id 
    // console.log(result);
    res.render('./listings/details', { result });

}));

// for edit details 

app.get('/home/edit/:id', wrapAsync(async(req,res)=>{
    if (!req.params.id) {
        throw new ExpressError(404, 'Listing not found ,bad request');
    }
    let id = req.params.id;
    let result = await Listing.findById(id);
    // console.log(result);   
    res.render('./listings/editdetails', {result});

}));

// now updating the details

app.post('/home/edit/:id',schemavalidation, wrapAsync(async(req,res)=>{
//    console.log(req.body);
//    console.log(listingSchemaValidation);
   const { error, value } = listingSchemaValidation.validate(req.body);
   if (error) {
       throw new ExpressError(400, error.message);
   }
   if (!req.params.id) {
       throw new ExpressError(404, 'Listing not found ,bad request');
   }
   let id = req.params.id;
   let {title,description,price,location,country} = req.body;
   await Listing.findByIdAndUpdate(req.params.id,{title:title,description:description,price:price,location:location,country:country},{runValidators:true});   
   res.redirect('/home');
}));


// for adding new data 

app.get('/home/add', wrapAsync((req, res) => {
    res.render('./listings/add');
}));

app.post('/home/add',schemavalidation, wrapAsync( async (req, res) => {
    
        // console.log(req.body);
        // console.log(listingSchemaValidation);

        let { title, description, image, price, location, country } = req.body;
        let newListing = new Listing({ title, description, image: { url: image }, price, location, country });
        await newListing.save();
        res.redirect('/home');
    
}));

// for deleting data 
//Delete Route (admin only functionality)

app.get('/home/delete/:id', wrapAsync(async (req, res) => {
        if (!req.params.id) {
            throw new ExpressError(404, 'Listing not found ,bad request');
        }
        const listingId = req.params.id;
        await Listing.findByIdAndDelete(listingId);
        res.status(200).redirect("/home");

}));

// post request on review form submission

app.post('/home/details/:id/reviews',reviewschemavalidation,wrapAsync(async (req, res) => {
    if (!req.params.id) {
        throw new ExpressError(404, 'Listing not found ,bad request');
    }
    // console.log(req.body);
    let id = req.params.id;
    let {reviewRating,reviewText} = req.body;

    let newReview = new Review({body:reviewText,rating:reviewRating});
    await newReview.save();
    await Listing.findByIdAndUpdate(id,{$push:{reviews:newReview._id}});
    console.log('review added successfully');
    res.redirect(`/home/details/${id}`);

}));


// handling other routes
app.all('*', (req, res, next) => {
    next(new ExpressError( 404 , 'Page Not Found'));
});

// server side error handling middleware

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render('./listings/error', {error: err});
})

// Start server on 8080
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
