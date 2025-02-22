const User = require('../models/user');

module.exports.getRegisterForm = (req, res) => {
    res.render('./auth/register.ejs');
}

module.exports.addNewUser = async (req, res) => {
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
}

module.exports.getLoginForm = (req, res) => {
    res.render('./auth/login.ejs');
}

module.exports.logicAfterLogin = (req, res) => {
      // Successful authentication
      req.flash('success', 'Logged in successfully');

      const pucchi = req.pucchi; // Retrieve from req object
      delete req.session.pucchiBeforeAuth; // Clear from session


      if (pucchi) {
          res.redirect(pucchi);
      } else {
          res.redirect('/home');
      }
}

module.exports.logoutUser = async (req, res) => {
    req.logout(err => {
        if (err) {
            next(err);
        }
        res.redirect('/home');
    });
}
