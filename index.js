const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const adminRouter = require('./routes/adminRoutes');
// const userRouter = require('./routes/userRouter')

const isblogExit = require('./middleware/blogExit');

const database_url = process.env.DATABASE_URL;
const PORTNO = process.env.PORT; 
const dbName = 'newblogger';

mongoose.connect(database_url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connection established to', dbName );
});


app.use(isblogExit.isblogExittorNot);
app.use('/', adminRouter);
// app.use('/', userRouter);


app.get('/', (req, res) => {
    res.send("I Love coding and creating application & websites");
});

app.listen(PORTNO, () => {
    console.log(`Server started on port ${PORTNO}`);
});