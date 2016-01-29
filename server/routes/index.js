var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');


router.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/'
    })
);

module.exports = router;