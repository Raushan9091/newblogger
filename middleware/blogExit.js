const blogSetting = require('../model/blogModel');

const isblogExittorNot = async (req, res, next)=>{
    try{

        const blog = await blogSetting.find({});

        if(blog.length == 0 && req.originalUrl != "/blog-setup"){
            res.redirect('/blog-setup');
        }
        else{
            next();
        }

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {isblogExittorNot};