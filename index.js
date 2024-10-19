const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRouter');
const bolgRoutes = require('./routes/blogRoutes');

const isblogExit = require('./middleware/blogExit');

let http = require('http').createServer(app);

let {Server} = require('socket.io');

let io = new Server (http,{});

const database_url = process.env.DATABASE_URL;

const dbName = 'newblogger';

mongoose.connect(database_url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connection established to', dbName );
});


app.use(isblogExit.isblogExittorNot);

app.use('/', adminRouter);

app.use('/', userRouter);

app.use('/', bolgRoutes);

app.get('/', (req, res) => {
    res.send("I Love coding and creating application & websites");
});

const PORTNO = process.env.PORT; 

io.on("connection", function(socket){
    console.log("User connection");
    socket.on("new_post", function(formData){
        console.log(formData);
        socket.broadcast.emit("new_post", formData);
    })
})

// app.listen(PORTNO, () => {
//     console.log(`Server started on port ${PORTNO}`);
// });

http.listen(PORTNO, () => {
    console.log(`Server started on port ${PORTNO}`);
});