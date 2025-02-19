// this file is for schema validation using joi

const Joi = require('joi');

const listingSchemaValidation = Joi.object({
    
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow('',null),  
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
   
});


const reviewsSchemavalidation= Joi.object({
        body : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5)
});

const userSchemaValidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = {listingSchemaValidation,reviewsSchemavalidation,userSchemaValidation};