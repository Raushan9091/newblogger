const mongoose = require('mongoose');

const blogModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        require: true,
    },
    is_admin:{
        type: String,
        require: true
    }
});

const blog = mongoose.model('blog', blogModel);

module.exports = blog;
