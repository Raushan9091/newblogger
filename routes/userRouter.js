const express = require('express');
const user_routers = express();

const bodyParser = require('body-parser');
user_routers.use(bodyParser.json());
user_routers.use(bodyParser.urlencoded({extended: true}));

user_routers.set('view engine', 'ejs');
user_routers.set('views','./views');

// const multer = require('multer');
// const path = require('path');

user_routers.use(express.static('public'));