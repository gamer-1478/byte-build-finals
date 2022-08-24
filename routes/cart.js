const express = require('express'),
    router = express.Router(),
    { ensureAdminAuthenticated, ensureAuthenticated } = require('../middlewares/authenticate.js'),
    {cart_get, cart_delete, cart_quantity_change} = require("../controllers/cart.js")


router.get('/', ensureAuthenticated, cart_get)

router.post('/delete/:id', ensureAuthenticated, cart_delete)

router.post('/quantity/:id', ensureAuthenticated, cart_quantity_change)


module.exports = router;