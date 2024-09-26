const BlogSetting = require('../model/blogModel');
const User = require('../model/userModel');
const Post = require('../model/postModel');
const bcrypt = require('bcrypt');


const securepassword = async(password)=>{
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }catch(error){
        console.error('Error hashing  password:',error.message);
        throw new Error('password hashing failed');
    }
}

const blogSetup = async(req,res)=>{
    try{

        const blog = await BlogSetting.find({});
        if(blog.length > 0 ){
            res.redirect('/login');
        }
        else{
            res.render('blogSetup');
        }
        
    }catch(error){
        console.error('Error fetching blogs:', error.message);
        res.status(500).send('Internal Server Error');
        
    } 
}


const dashboard = async(req, res)=>{
    try{
        res.render('admin/dashboard');
    }catch(error){
        console.log(error.message);

    }
}

const loadpostdashboard = async(req, res)=>{
    try{
        res.render('admin/postDashboard');
    }catch(error){
        console.log(error.message);
    }
}


const addPost = async(req, res)=>{
    try {    

        const newPost = new Post({
            title: req.body.title,
            content : req.body.content
        
        });
        
        const postData = await newPost.save();

        res.render('admin/postDashboard', {message: 'Post added Successfully'});

    } catch (error) {
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
            blog_image:blog_image,
            blog_description:description
        });
        
        const savedBlog = await newBlog.save();
        console.log('Blog:',savedBlog);

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
   dashboard,
   loadpostdashboard,
   addPost
}
