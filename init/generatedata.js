// const Listing = require('./listing'); // model 
// const { faker } = require('@faker-js/faker');

// const generateSampleData = async (count) => {
//   try {
//     if (!Number.isInteger(count) || count <= 0) {
//       throw new Error('Invalid count value. Must be a positive integer.');
//     }

//     const listings = [];

//     for (let i = 0; i < count; i++) {
//       const listing = {
//         title: faker.commerce.product(),
//         description: faker.commerce.productDescription(),
//         image: faker.image.url(),
//         price: faker.commerce.price(),
//         location: faker.location.city(),
//         country: faker.location.country(),
//       };

//       listings.push(listing);
//     }

//     await Listing.insertMany(listings);
//     console.log('Sample data inserted successfully.');
//     console.log(listings);
//   } catch (error) {
//     console.error('Error generating sample data:', error);
//   }
// };


// // generateSampleData(10);

// module.exports = generateSampleData;
