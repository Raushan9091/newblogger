const express = require('express');
const admin_routes = express();

const bodyParser = require('body-parser');
admin_routes.use(bodyParser.json());
admin_routes.use(bodyParser.urlencoded({extended: true}));

admin_routes.set('view engine', 'ejs');
admin_routes.set('views','./views');

const multer = require('multer');
const path = require('path');

admin_routes.use(express.static('public'));


const storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        const uploadPath = path.join(__dirname, '../public/images'); 
        console.log('Resolved upload path', uploadPath); 
        cb(null, uploadPath); 
    }, 
    filename: function (req, file, cb) { 
        const name = Date.now() + '-' + file.originalname; 
        cb(null, name); 
    } 
})

const upload = multer({ storage: storage });


const adminController = require('../controller/adminController');

// admin_routes.get('/login',adminController.login);

admin_routes.get('/blog-setup',adminController.blogSetup);

admin_routes.post('/blog-setup',upload.single('blog_image'),adminController.blogSetupSave)

module.exports = admin_routes; 

