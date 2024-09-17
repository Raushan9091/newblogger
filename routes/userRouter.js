const express = require('express');
const user_router = express();
require('dotenv').config();

const bodyParser = require('body-parser');
user_router.use(bodyParser.json());
user_router.use(bodyParser.urlencoded({extended: true}));

user_router.set('view engine', 'ejs');
user_router.set('views','./views');

// const multer = require('multer');
// const path = require('path');

user_router.use(express.static('public'));
const session = require('express-session');

const SessionSecretKey = process.env.SESSION_SECRET_KEY;

user_router.use(session({
    secret: SessionSecretKey,
    resave: true,
    saveUninitialized: true,
    // cookie: {secure:true},
}));


const userController = require('../controller/userController');
const { Cookie } = require('express-session');
const adminLoginAuth = require('../middleware/adminLoginAuth');

user_router.get('/login',adminLoginAuth.isLogout , userController.logingloader);
user_router.post('/login',userController.verifyLogin);
user_router.get('/profile',userController.profile)
module.exports = user_router;