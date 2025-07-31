// loads environment variables from a .env file into process.env
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const app = express();

const path = require('path');

// connecting to db
const { connectDB,insertdata,store } = require('./init/connectDB');

// Connect to DB and initialize data
(async () => {
    await connectDB();
    // await deleteData();
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

// //express sessions
const session = require('express-session');

const sessionOptions= {
    store,
    secret: process.env.SECRET,

    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionOptions));

// flash messages
const flash = require('connect-flash');
app.use(flash());

// passport module for authentication

//import mongoose models 
const User = require('./models/user');
// Initialize Passport
const passport = require('passport');

// Initialize Passport (This is correct)
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport-Local (CORRECT WAY with passport-local-mongoose)
passport.use(User.createStrategy()); // Use createStrategy() - NOT new LocalStrategy()

// Serialize and deserialize user (This is correct with passport-local-mongoose)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to make things accessible in ejs templates
app.use((req, res, next) => {
    // For flash messages
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    // For current user
    res.locals.currentUser = req.user;
    console.log(res.locals.currentUser);
    next();
});


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
