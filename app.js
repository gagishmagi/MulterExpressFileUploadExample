var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
// var upload = multer({dest:'uploads/'});

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'uploads/')
    },
    filename: function (req, file, cb) {
        console.log(file)
        if (file.mimetype === 'image/png')
            cb(null, file.fieldname + "/"
               + Date.now() + file.originalname)

        // cb(null, file.originalname)
    },
})

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        //allowed Images types only
        // let allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
        // allowedTypes.filter((type) => type !== file.mimetype)

        if(!file.originalname.match("\.(jpg|jpeg|png|gif|pdf)")){
            return cb(new Error('Only images and pdfs are allowed'), false)
        }
        cb(null, true)
    },
    limits: {
        files: 4, //allow only single file to upload to server
        fieldSize: 5 * 1024 * 1024 // max file size 5MB
    }
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var imagesRouter = require('./routes/images');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(upload.array())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/images', imagesRouter);


app.post('/', upload.single('yourImage'), function (req, res, next) {
    console.log(req.body)
    console.log(req.file)

    res.send("OK")
});

app.post('/', upload.array('photos', 4), function (req, res, next) {
    console.log(req.body)
    console.log(req.files)

    var photos = req.files

    try {
        if (!photos) {
            res.status(400).send({
                status: false,
                message: 'Files weren\'t selected or faild to upload try again'
            })
        } else {
            let data = []
            photos.map(function (p) {
                data.push({
                    name: p.originalname,
                    mimetype: p.mimetype,
                    size: p.size
                })
            })

            res.status(200).send({
                status: true,
                message: 'Photos Uploaded successfully',
                data: data
            })
        }

    } catch (error) {
        res.status(500).send(error)
    }

    // res.send("OK")
});


module.exports = app;
