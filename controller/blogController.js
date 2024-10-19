const Post = require('../model/postModel')
const { ObjectId } = require('mongodb')

const nodemailer = require('nodemailer');
require('dotenv').config();
emailUser = process.env.EMAILUSER;
emailPassword = process.env.EMAILPASSWORD;

const sendMailOncommentReply = async (email, name, post_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 578,
            secure: false, //true for port 465, false for other ports,
            requireTLS: true,
            auth: {
                user: emailUser,
                pass: emailPassword,
            },
        });

        const mailOptions = {
            from: emailUser,
            to: email,
            subject: 'New Reply Added!!!',
            html: '<p> Hii ' + name + ', has replied over your comment <a href="http://127.0.0.1:2720/post/' + post_id + '">Read Here</a> </p>'
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("email has been send:-", info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}
const loadBlogs = async (req, res) => {
    try {

        const posts = await Post.find({});
        res.render('blog', { posts: posts });

    } catch (error) {
        console.log(error.message);

    }
}

const loadPost = async (req, res) => {
    try {

        const post = await Post.findOne({ "_id": req.params.id });

        res.render('post', { post: post });

    } catch (error) {
        console.log(error.message);
    }
}


const addComment = async (req, res) => {
    try {

        const post_id = req.body.post_id;
        const Username = req.body.Username;
        const email = req.body.email;
        const comment = req.body.comment;

        let comment_id = new ObjectId();

        // await Post.findByIdAndUpdate({_id:post_id }, { $push:{ "comments": {_id:comment_id, email: email, Username: Username,  comment: comment}}});
        await Post.findByIdAndUpdate({ _id: post_id }, { $push: { "comments": { _id: comment_id, email: email, Username: Username, comment: comment } } });
        res.status(200).send({ success: true, msg: 'Comment Added!!!' });
    }
    catch (error) {
        res.status(200).send({ success: false, msg: error.message })
    }
}

const doReply = async (req, res) => {
    try {
        let reply_id = new ObjectId();
        await Post.updateOne({
            "_id": new ObjectId(req.body.post_id),
            "comments._id": new ObjectId(req.body.comment_id)
        }, {
            $push: {
                "comments.$.replies": { _id: reply_id, name: req.body.name, reply: req.body.reply }
            }
        });
        sendMailOncommentReply(req.body.email, req.body.name, req.body.post_id);
        res.status(200).send({ success: true, msg: "successfully comment Added" });
    }
    catch (error) {
        res.status(200).send({ success: false, msg: error.message });
    }
}


module.exports = {
    loadBlogs,
    loadPost,
    addComment,
    doReply
}
