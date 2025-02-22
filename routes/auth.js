const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const wrapAsync = require('../utils/wrapAsyncFunction');
const User = require('../models/user'); // Import the User model
const { userSchemaValidation } = require('../utils/schemavalidation');

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
router.get('/register', (req, res) => {
    res.render('./auth/register.ejs');
});

router.post('/register',validateUserSchema, wrapAsync(async (req, res) => {
        console.log(req.body);
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        let result =   await User.register(user, password);
         // if user not register send flash message
        if(!result){
            req.flash('error', 'User not registered');
            return res.redirect('/auth/register');
        }

        req.logIn(user,(err)=> {
            if(err){
                next(err);
            }
            req.flash('success', 'User registered successfully');
            res.redirect('/home');
            
        })
       
        
}));

// Login route
router.get('/login', (req, res) => {
    res.render('./auth/login.ejs');
});

// Login route (SIMPLIFIED and CORRECTED)
router.post('/login',
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
    (req, res) => {
      // Successful authentication
      req.flash('success', 'Logged in successfully');

      const pucchi = req.pucchi; // Retrieve from req object
      delete req.session.pucchiBeforeAuth; // Clear from session


      if (pucchi) {
          res.redirect(pucchi);
      } else {
          res.redirect('/home');
      }
});



// Logout route
router.get('/logout', wrapAsync(async (req, res) => {
    req.logout(err => {
        if (err) {
            next(err);
        }
        res.redirect('/home');
    });
}));

module.exports = router;
