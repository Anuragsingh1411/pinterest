var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');

const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res, next) {
  res.render("register");
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render("profile");
});

router.post('/register', function(req, res, next) { 
  var data = new userModel({
    username: req.body.username,
    password: req.body.password,
    email:req.body.email,
    contact: req.body.contact,
  });
  
  userModel.register(data, req.body.password)
    .then(function(){
      // Authenticate user after successful registration
      passport.authenticate("local")(req, res, function(){
        res.redirect("/profile"); // Redirect to profile page after login
      })
    })
});


router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile"
}),function (req,res) { }) 


router.get('/logout', function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

module.exports = router;
