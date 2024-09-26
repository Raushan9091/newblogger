const User = require('../model/userModel');
const bcrypt = require('bcrypt');

const logingloader = async(req, res)=>{
    try{
        res.render('login');
    }catch(error){
        console.log(error.message);

    }
}


const profile = async(req, res)=>{
    try{
        res.send('I am in profile');
    }catch(error){
        console.log(error.message);

    }
}

const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/login');
    }catch(error){
        console.log(error.message);
    }
    
}

const verifyLogin = async(req, res)=>{
    try{
        console.log(req.body.email);
        const email = req.body.email;
        const password = req.body.password;
        
        const UserData = await User.findOne({email:email});

        if(UserData){
            console.log(UserData);
            const passwordMatch = await bcrypt.compare(password, UserData.password);
            req.session.User_id = UserData._id;
            req.session.is_admin = UserData.is_admin;
            if(passwordMatch){
                if(UserData.is_admin == 1){
                    res.redirect('/dashboard');
                }else{
                    res.redirect('/profile');
                }

            }else{
                req.render('login',{message:" Incorrect password!!"});
            }

        }
        else{
            res.render('login',{message:"Enter-id doesnot exist"});
        }

    }catch(error){
        console.log(error.message);
    }
}

module.exports ={
    logingloader,
    verifyLogin,
    profile,
    logout
}