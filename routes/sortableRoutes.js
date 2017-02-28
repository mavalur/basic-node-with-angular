/**
 * Created by Mavalur on 2/25/17.
 */
var express = require("express");
var fs = require("fs");
var processor = require('./processor.svc');
var router = express.Router();


var allUsers = {
    "HM": {
        name: "Harikumar Mavalur",
        age: 30,
        gender: "male"
    }, "TK": {
        name: "Tamizhselvi kaslingam",
        age: 31,
        gender: "female"
    }, "AM": {
        name: "Akshaya Harikumar",
        age: 5,
        gender: "female"
    }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send(allUsers);
});


router.get('/:name', function (req, res, next) {

    var options = {
        root: __dirname + '/data/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = req.params.name;
    /*res.render(fileName, options, function (err) {
     if (err) {
     next(err);
     } else {
     console.log('Sent:', fileName);
     }
     });*/
    console.log(__dirname);
    fs.readFile('data/'+fileName,'utf-8', function (err,data) {
        if (err) throw err;
        return res.json(data);
    });


});

module.exports = router;
