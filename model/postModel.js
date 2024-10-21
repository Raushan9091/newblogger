const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const postSchema  = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    comments:{
        type: Object,
        default:{}
    },
    image:{
        type: String,
        default:''
    }

});

module.exports = mongoose.model('Post', postSchema);