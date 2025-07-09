// loads environment variables from a .env file into process.env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

async function connectDB() {
    try {
        await mongoose.connect(process.env.ATLASDB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    secret: process.env.SECRET,
    touchAfter: 24 * 3600 // time in seconds
});
store.on('error', function (e) {
    console.log('Session store error', e);
});


// importing models
const Listing = require('../models/listing');
let data = require('./TouristPlacesDataset');
const Review = require('../models/review');
const { storage } = require('../cloudconfig');


// inserting data into db using function
// async function insertdata() {
//     try {
//         // mapping an owner to each listing
//         data = data.map((listing) => ({...listing, owner :'67b4bcefc092b1ea23d9d9ef'})); 
//         await Listing.insertMany(data);
//         console.log('Sample data inserted successfully.');

//         } catch (error) {
//         console.error('Error generating sample data:', error);
//         }
// }; 

// deleting previous data
//  async function deleteData() {
//     try {
//         await Listing.deleteMany({});
//         await Review.deleteMany({});
//         console.log('Previous data deleted successfully.');
//     } catch (error) {
//         console.error('Error deleting previous data:', error);
//     }
// }

module.exports = { connectDB,store};

