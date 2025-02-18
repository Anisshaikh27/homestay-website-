const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/majorprojectdatabase');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}



// importing models
const Listing = require('../models/listing');
const data = require('./TouristPlacesDataset');
const Review = require('../models/reviews');


// inserting data into db using function
async function insertdata() {

    try {
        await Listing.insertMany(data);
        console.log('Sample data inserted successfully.');
    
        } catch (error) {
        console.error('Error generating sample data:', error);
        }
}; 



// deleting previous data
 async function deleteData() {
    try {
        await Listing.deleteMany({});
        await Review.deleteMany({});
        console.log('Previous data deleted successfully.');
    } catch (error) {
        console.error('Error deleting previous data:', error);
    }
}

module.exports = { connectDB, insertdata, deleteData };

