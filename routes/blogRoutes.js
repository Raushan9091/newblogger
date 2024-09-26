const express = require("express");
const bolg_routs = express();

bolg_routs.set('view engine', 'ejs');
bolg_routs.set('views', './views');

bolg_routs.use(express.static('public'))

const blogController = require('../controller/blogController');

bolg_routs.get('/', blogController.loadBlogs);

bolg_routs.get('/post/:id',blogController.loadPost)

module.exports = bolg_routs;