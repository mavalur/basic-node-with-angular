var express = require('express');
var router = express.Router();


var allUsers = {
    "HM": {
        name: "Harikumar Mavalur",
        age: 30,
        gender: "male"
    },"TK": {
        name: "Tamizhselvi kaslingam",
        age: 31,
        gender: "female"
    },"AM": {
        name: "Akshaya Harikumar",
        age: 5,
        gender: "female"
    }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send(allUsers);
});


/* GET users listing. */
router.get('/:initial', function (req, res, next) {
    res.send(allUsers[req.params.initial]);
});


module.exports = router;
