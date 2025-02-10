// this js file is for custom error handling in express 

class ExpressError extends Error {
    constructor( statusCode,message) {
        
        super(); //need to call parent class constructor first
        
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;