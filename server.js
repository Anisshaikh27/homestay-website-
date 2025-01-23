const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');



// connecting to db
const { connectDB, deleteData, insertdata } = require('./init/connectDB');

// Connect to DB and initialize data
(async () => {
    await connectDB();
    await deleteData();
    await insertdata();
})();

// importing models
const Listing = require('./models/listing');


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


// Routing

// for home page
app.get('/home', async (req, res) => {
    try {
        const listings = await Listing.find({});
        res.render('./listings/home', { listings });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).send('Error fetching listings');
    }
});


// for specific details page 
// http://localhost:8080/home/details/6791f35ded139052510d6192
app.get('/home/details/:id', async (req, res) => {

    let id = req.params.id; 
    console.log(id);
    let result = await Listing.findById(id);
    console.log(result);
    res.render('./listings/details', { result });

});

// for edit details 

app.get('/home/edit/:id', async(req,res)=>{
    let id = req.params.id;
    let result = await Listing.findById(id);
    console.log(result);   
    res.render('./listings/editdetails', {result});

})

// now updating the details

app.post('/home/edit/:id', async(req,res)=>{
   console.log(req.body);
   let id = req.params.id;
   let {title,description,price,location,country} = req.body;
   await Listing.findByIdAndUpdate(req.params.id,{title:title,description:description,price:price,location:location,country:country},{runValidators:true});   
   res.redirect('/home');
});


// for adding new data 

app.get('/home/add', (req, res) => {
    res.render('./listings/add');
});

app.post('/home/add', async (req, res) => {
    console.log(req.body);
    let { title, description, image, price, location, country } = req.body;
    let newListing = new Listing({ title, description, image: { url: image }, price, location, country });
    await newListing.save();
    res.redirect('/home');
});

// for deleting data 
//Delete Route

app.get('/home/delete/:id', async (req, res) => {
    try {
        const listingId = req.params.id;
        await Listing.findByIdAndDelete(listingId);
        res.status(200).redirect("/home");
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting listing');
    }
});

// Start server on 8080
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
