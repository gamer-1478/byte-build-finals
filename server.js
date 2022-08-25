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
    store = require('./routes/store.js'),
    cart = require('./routes/cart.js'),
    dashboard = require('./routes/dashboard.js'),
    checkout = require('./routes/checkout.js'),
    admin = require('./routes/admin.js'),
    product = require('./routes/product.js'),
    review = require('./routes/review.js'),
    orders = require('./routes/orders.js'),
    profile = require('./routes/profile.js');

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
app.use('/', landing)
app.use('/auth', auth)
app.use('/admin', admin)
app.use('/dashboard', dashboard)
app.use('/cart', cart)
app.use('/store', store)
app.use('/checkout', checkout)
app.use('/review', review)
app.use('/orders', orders)
app.use('/profile', profile)

app.get('/404', (req, res) => {
    res.render('404', { user: req.user })
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


//Todo
//repurpose cart and ecom from pokemon app
//customer can review products.
//