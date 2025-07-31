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
const User = require('../models/user');
const { storage } = require('../cloudconfig');



async function insertData() {
  try {
    // 1. Check if 'admin' user already exists
    let user = await User.findOne({ username: 'admin' });

    if (!user) {
      const newUser = new User({ username: 'admin', email: 'admin@gmail.com' });
      user = await User.register(newUser, 'admin');
      console.log('Admin user created!');
    } else {
      console.log('Admin user already exists.');
    }

    // 2. Only insert listings if none exist
    const existingListings = await Listing.find({});
    if (existingListings.length === 0) {
      const updatedData = data.map(listing => ({
        ...listing,
        owner: user._id
      }));
      await Listing.insertMany(updatedData);
      console.log('Sample listings inserted.');
    } else {
      console.log('Listings already exist. Skipping insert.');
    }

  } catch (error) {
    console.error('Error inserting data:', error);
  }
}


// // inserting data into db using function
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

module.exports = { connectDB,insertData,store};

