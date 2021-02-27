const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const passport = require('passport');

//LOGIN ROUTES
router.get('/login',(req,res)=>{
  res.render('login');
});

router.get('/register',(req,res)=>{
  res.render('register')
});

// REGISTER ROUTES
router.post('/register',(req,res)=> {
  // Check fields filled in
  const {name, email, password, password2} = req.body;
  let errors = [];
  console.log('Name: ' + name + '; Email: ' + email + '; Password: ' + password);
  if(!name || !email || !password || !password2) {
    errors.push({msg : "Please fill in all fields."})
  };
  // Check if passwords match
  if(password !== password2) {
    errors.push({msg : "Passwords don't match."});
  };

  // Check if password is 6 or more characters long
  if(password.length < 6 ) {
    errors.push({msg : 'Password must be at least 6 characters long.'})
  };

  // Password validation failed
  if(errors.length > 0 ) {
  res.render('register', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2
    });
  } else {
    // Password validation passed
    User.findOne({ email: email }).exec((err, user) => {
      if (user) {
        console.log('user: ', user);
        errors.push({ msg: 'Email address already registered.' });
        res.render('register', { errors, name, email, password, password2 });
      } else {
        const newUser = new User ({
          name : name,
          email : email,
          password : password
        });
        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err,hash) => {
            if (err) { throw err; }
            //save pass to hash
            newUser.password = hash;
            //save user
            newUser.save()
              .then((value) => {
                console.log('valueA: ', value);
                req.flash('success_msg','You have now registered!');
                res.redirect('/users/login');
              })
              .catch((value) => console.log('valueB: ', value));
          });
        });
      } //ELSE statement ends here
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// LOGOUT ROUTES
router.get('/logout',(req,res)=>{
  //
});

module.exports  = router;