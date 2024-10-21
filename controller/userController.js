const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
require('dotenv').config();
emailUser = process.env.EMAILUSER;
emailPassword = process.env.EMAILPASSWORD;

const adminController = require('../controller/adminController')


const logingloader = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);

    }
}


const profile = async (req, res) => {
    try {
        res.send('I am in profile');
    } catch (error) {
        console.log(error.message);

    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }

}

const verifyLogin = async (req, res) => {
    try {
        console.log(req.body.email);
        const email = req.body.email;
        const password = req.body.password;

        const UserData = await User.findOne({ email: email });

        if (UserData) {
            console.log(UserData);
            const passwordMatch = await bcrypt.compare(password, UserData.password);
            req.session.User_id = UserData._id;
            req.session.is_admin = UserData.is_admin;
            
            if (passwordMatch) {
                if (UserData.is_admin == 1) {
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/profile');
                }

            } else {
                req.render('login', { message: " Incorrect password!!" });
            }

        }
        else {
            res.render('login', { message: "Enter-id doesnot exist" });
        }

    } catch (error) {
        console.log(error.message);
    }
}



const forgetLoad = (req, res) => {
    try {

        res.render('forget-password');

    } catch (error) {
        console.log(error);
    }
}


const forgetpasswordverfiy = async (req, res) => {
    try {

        const email = req.body.email;
        const UserData = await User.findOne({ email: email });

        if (UserData) {

            const generatedToken = randomstring.generate();

            await User.updateOne({ email: email }, { $set: { token: generatedToken } });

            sendResetPasswordMail(UserData.name, UserData.email, generatedToken);

            res.render('forget-password', { message: "please check your mail to Reset Your password" })
        }
        else {
            res.render('forget.password', { message: "User email doesnot exists or entered email is incorrect" });
        }

    } catch (error) {
        console.log(error.message);
    }
}


const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports,
            requireTLS: true,
            auth: {
                user: emailUser,
                pass: emailPassword,
            },
        });

        const mailOptions = {
            from: emailUser,
            to: email,
            subject: 'Reset Password',
            html: '<p> Hii ' + name + ', Please click here to <a href="http://127.0.0.1:2720/reset-password?token=' + token + '">Reset</a> your Password'
        }

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent", info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}


const resetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;

        const tokenBaseData = await User.findOne({ token: token });

        if (tokenBaseData) {
            res.render('reset-password', { User_id: tokenBaseData._id });

        }
        else {
            res.render('404');
        }

    } catch (error) {
        console.log(error.message);
    }
}


const resetPassword = async (req, res) => {
    try {

        const password = req.body.password;
        const User_id = req.body.User_id;
        const securepassword = await adminController.securepassword(password);
        User.findByIdAndUpdate({ _id: User_id }, { $set: { password: securepassword, token: '' } });

        req.redirect('/login');

    } catch (error) {
        res.render('404');
    }
}


module.exports = {
    logingloader,
    verifyLogin,
    profile,
    logout,
    forgetLoad,
    forgetpasswordverfiy,
    resetPasswordLoad,
    resetPassword


}