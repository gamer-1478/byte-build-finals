require('dotenv').config()

//modules
const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    ejs = require('ejs'),
    path = require('path'),
    session = require('cookie-session'),
    passport = require('passport'),
    passportInit = require('./utils/passportConfig.js'),
    flash = require('express-flash'),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose');

//routes
const landing = require('./routes/landing.js'),
    auth = require('./routes/auth.js'),
    admin = require('./routes/admin.js');

const app = express(),
    PORT = process.env.PORT || 5000;

//app middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }), express.urlencoded({ extended: true, limit: '1mb' }))
app.use(flash())
app.use(expressLayouts)
app.use('/', express.static('public'))

//passport middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}))

passportInit(passport)

//connect mongodb
const dbUri = process.env.MONGO_URI
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log("Connected to mongodb"))

//more passport
app.use(passport.initialize())
app.use(passport.session())

//main
app.use('/', landing) //done
app.use('/auth', auth) //domne
app.use('/admin', admin) //add pages

app.get('/404', (req, res) => {
    res.render('404', { user: req.user })
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})