const express = require('express');
const app = express();

const path = require('path');

// connecting to db
const { connectDB, deleteData, insertdata } = require('./init/connectDB');

// Connect to DB and initialize data
(async () => {
    await connectDB();
    await deleteData();
    await insertdata();
})();

// importing ExpressError class for custom error handling
const ExpressError = require('./utils/ExpressError');


// middlewares
// ORDER MATTERSS IN MIDDLEWARE
// // requiring  ejs mate engine
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

// setting view engine and path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// to get req res params 
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (for API clients)
app.use(express.json());

//express sessions
const session = require('express-session');

const sessionOptions= {
    secret: 'mysupersecretcode',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOptions));

// passport module for authentication

//import mongoose models 
const User = require('./models/user');
// Initialize Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport-Local
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routing
    //for lising routes
app.use(['/home','/'], require('./routes/listing'));
    //for review routes
app.use('/home/details/:id', require('./routes/review'));
    //for user authentication routes
app.use('/auth', require('./routes/auth'));


// handling other routes
app.all('*', (req, res, next) => {
    next(new ExpressError( 404 , 'Page Not Found'));
});

// server side error handling middleware

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render('./listings/error', {error: err});
})

// Start server on 8080
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
