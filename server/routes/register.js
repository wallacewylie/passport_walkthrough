var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../../models/user');


router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/register.html'));
    console.log("Hello");
});


router.post('/', function(req,res,next){
    Users.create(req.body, function (err, post){
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    })
});

module.exports = router;

