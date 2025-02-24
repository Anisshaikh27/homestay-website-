const Listing = require('../models/listing');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');


module.exports.getAllListings = async (req, res) => {
    // res.send('add page');
    const listings = await Listing.find({});
    res.render('./listings/home', { listings });
}

module.exports.getListingDetails = async (req, res) => {
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
}

module.exports.getEditForm = async(req,res)=>{
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
}

module.exports.updateListingDetails = async(req,res)=>{

    // console.log(req.body);
    let {title,description,price,location,country} = req.body;
    
    await Listing.findByIdAndUpdate(req.params.id,{title:title,description:description,price:price,location:location,country:country},{runValidators:true}); 
    req.flash('success', 'Listing updated successfully');
    res.redirect('/home');
}

module.exports.getAddNewListingForm = (req, res) => {
        res.render('./listings/add');
}

module.exports.AddNewListing = async (req, res) => {
    console.log(req.file);
    console.log(req.body);

    let { title, description, image, price, location, country } = req.body;
    let newListing = new Listing({ title, description, image: { url: req.file.path,filename: req.file.filename }, price, location, country, owner: req.user._id }); 
    
    await newListing.save();
    req.flash('success', 'Listing added successfully');
    res.redirect('/home');

}

module.exports.deleteListing = async (req, res) => {
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
    
}
    
