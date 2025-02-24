const express = require('express');
const passport = require('passport');

const wrapAsync = require('../utils/wrapAsyncFunction');
const User = require('../models/user'); // Import the User model
const { userSchemaValidation } = require('../utils/schemavalidation');
const { logicAfterLogin, logoutUser, getLoginForm, addNewUser, getRegisterForm } = require('../controllers/auth');
const { get } = require('mongoose');

const router = express.Router();


//validation middlewares
const validateUserSchema = (req,res,next)=> {
    const { error, value } = userSchemaValidation.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    }else{
        next();
    }
}



// Registration route
router.get('/register', getRegisterForm );

router.post('/register',validateUserSchema, wrapAsync(addNewUser));

// Login route
router.route('/login')
    .get( getLoginForm)

    // Login route (SIMPLIFIED and CORRECTED)
    .post(
    (req,res,next) => { // Middleware to retrieve before authentication
        const pucchi = req.session.pucchiBeforeAuth;
        req.pucchi = pucchi; // Put it on req so the next middleware can access it.
        next();
    },
    passport.authenticate('local', {
      failureRedirect: '/auth/login', // Redirect back to login on failure
      failureFlash: true, // Optional: for flash messages
      successFlash: true // Optional: for flash messages
    }),
    logicAfterLogin);


// Logout route
router.get('/logout', wrapAsync(logoutUser));

module.exports = router;
