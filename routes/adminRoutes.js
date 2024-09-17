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

admin_routes.use(express.static('public'));

const session = require('express-session');
const SessionSecretKey = process.env.SESSION_SECRET_KEY;
admin_routes.use(session({
    secret: SessionSecretKey,
    resave: true,
    saveUninitialized: true,
    // cookie: {secure:true},
}));


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
const adminLoginAuth = require('../middleware/adminLoginAuth');

admin_routes.get('/blog-setup',adminController.blogSetup);

admin_routes.post('/blog-setup',upload.single('blog_image'),adminController.blogSetupSave);

admin_routes.get('/dashboard',adminLoginAuth.isLogin, adminController.dashboard);

module.exports = admin_routes; 

