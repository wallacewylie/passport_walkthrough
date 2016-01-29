var express = require('express');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var index = require('./routes/index');

var register = require('./routes/register');
var success = require('./routes/success');


var User = require('../models/user');

var localStrategy = require('passport-local').Strategy;

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static('server/public'));


app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/register', register);
app.use('/success', success);
app.use('/', index);


// Mongo setup
var mongoURI = "mongodb://localhost:27017/prime_example_passport";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function (err){
    console.log('mongodb connection error', err);
});

MongoDB.once('open', function (){
    console.log('mongodb connection open');
});

//passport stuff

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
        if(err) done(err);
        done(null, user);
    });
});


passport.use('local', new localStrategy({
        passReqToCallback: true,
        usernameField: 'username'
    },
    function(req, username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err) throw err;
            if (!user)
                return done(null, false, {message: 'Incorrect username and password.'});

            //test a matching password
            user.comparePassword(password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch)
                    return done(null, user);
                else
                    done(null, false, {message: "Incorrect username and password"});
            });
        });

    }));


var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log('Listening on port: ', port);
});


