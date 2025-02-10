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

module.exports = listingSchemaValidation;