var express = require('express');
var router = express.Router();
var path = require('path')

/* GET images listing. */
router.get('/yourImage/:imageName', function (req, res, next) {
    var imageName = req.params.imageName
    res.sendFile(path.join(__dirname, '..', 'uploads', 'yourImage', imageName))
});

module.exports = router;
