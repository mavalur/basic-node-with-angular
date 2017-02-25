var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("hello.html")
//  res.sendfile("hello.html")
  //res.render('hello.html', { title: 'Express' });
});

module.exports = router;
