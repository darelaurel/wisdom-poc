const express = require('express');
const session = require('express-session')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const oneDay = 1000 * 60 * 60 * 24;

// const admin = require("firebase-admin");

// const serviceAccount = require(path.join(__dirname,'/config/just-plate-316506-5a64d98ec09d.json'));

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name:"__session",
    secret: "NUCmWgta4bNMeWbpGEUD5Oow",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false 
}))

app.use('/', indexRouter);

app.listen(5000, () => {
    console.log('Listening on port 5000')
})

module.exports = app;
