const BlogSetting = require('../model/blogModel');
const User = require('../model/userModel');
const bcrypt = require('bcrypt');

// const login = async(req,res)=>{
//     res.send('Login me hai');
// }


const securepassword = async(password)=>{
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
    }catch(error){
        console.log(error.message);
    }
}

const blogSetup = async(req,res)=>{
    try{

        const blog = await BlogSetting.find({});
        if(blog.length>0){
            res.redirect('/login');
        }
        else{
            res.render('blogSetup.ejs');
        }
        
    }catch(error){
        console.log(error.message);
    } 
}

const blogSetupSave = async(req,res)=>{
    try{
        console.log('File Info:', req.file);

        const blog_title = req.body.blog_title;
        const blog_image = req.file.filename;
        const description = req.body.description;
        const name = req.body.name;
        const email = req.body.email;
        const password = await securepassword(req.body.password);
        

        const  newBlog = new BlogSetting({
            blog_title:blog_title,
            blog_logo:blog_image,
            blog_description:description
        });
        
        const savedBlog = await newBlog.save();
        console.log('Blog:', savedBlog);

        const newUser = new User({
            name:name,
            email: email,
            password:password,
            is_admin: 1
        })

        const saveUser = await newUser.save();
        console.log('User saved:', saveUser);

        if(saveUser ){
            res.redirect('/login');
        }
        else{
            res.render('blogSetup',{message:"Blog setup has some problem"});
        }

    }catch(error){
        console.log(error.message);
    }
}
module.exports ={
    blogSetupSave,
   blogSetup,
//    login
}
