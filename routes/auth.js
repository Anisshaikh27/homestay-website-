const express = require('express');
const passport = require('passport');

const wrapAsync = require('../utils/wrapAsyncFunction');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// Registration route
router.get('/register', (req, res) => {
    res.render('./auth/register.ejs');
});

router.post('/register', wrapAsync(async (req, res) => {
        console.log(req.body);
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        res.redirect('/auth/login');
}));

// Login route
router.get('/login', (req, res) => {
    res.render('./auth/login.ejs');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Internal server error during authentication
            return res.status(500).send({ message: 'An error occurred during login.', error: err });
        }
        if (!user) {
            // Invalid credentials
            return res.status(401).send({ message: info.message || 'Invalid username or password.' });
        }
        // If authentication succeeds, log the user in
        req.logIn(user, (err) => {
            if (err) {
                // Error while logging in
                return res.status(500).send({ message: 'Error logging you in.', error: err });
            }
            // Successfully logged in
            return res.status(200).send({ message: 'Login successful!' });
        });
    })(req, res, next);
});



// Logout route
router.get('/logout', wrapAsync(async (req, res) => {
    req.logout(err => {
        if (err) return res.send('Error logging out');
        res.redirect('/home');
    });
}));

module.exports = router;
