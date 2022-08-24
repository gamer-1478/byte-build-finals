const express = require('express'),
    moment = require('moment'),
    now = new Date(),
    dateStringWithTime = moment(now).format('YYYY-MM-DD HH:MM:SS'),
    { nanoid } = require('nanoid'),
    router = express.Router(),
    { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/authenticate.js'),
    User = require('../schemas/userSchema'),
    Product = require("../schemas/productSchema"),
    stripe_req = require('stripe'),
    Order = require('../schemas/orderSchema');

const stripe = stripe_req(process.env.STRIPE);

const paymentLink = async (orderid, req, lineItems) => {
    return await stripe.paymentLinks.create({
        line_items: lineItems,
        // line_items: [
        //     {
        //         price: 'price_1LaCP2DHsu3wcW29MLZXXVc0',
        //         quantity: 1,
        //     },
        // ],
        after_completion: { type: 'redirect', redirect: { url: req.protocol + '://' + req.get('host') +'/checkout/confirm-order/'+orderid } },
    }).then((link) => {
        return link;
    });
}

router.get('/', (req, res) => {
    if (!req.user.cart.length > 0) {
        return res.redirect('/cart');
    }
    var total = 0;
    var products = req.user.cart.map(async (product_orig) => {
        var product = await Product.findOne({ productId: product_orig.prodid })
        product = JSON.parse(JSON.stringify(product))
        total += product.price * product_orig.quan
        product.quantity = product_orig.quan
        return product;
    })
    Promise.all(products).then(async products => {
        res.render("store/checkout", { user: req.user, cart: products, total: total })
    }).catch(err => {
        console.log(err)
    })
});

router.post('/', ensureAuthenticated, async (req, res) => {
    const { line1, line2, line3, name} = req.body;

    const user = await User.findOne({ userId: req.user.userId })
    const orderId = nanoid()
    const stripe_hidden = nanoid() + nanoid()
    if (!line1 || !line2 || !line3 || !name) {
        return res.send({message: "Please fill in all fields", success: false})
    }
    
    var products = req.user.cart.map(async (product_orig) => {
        var product = await Product.findOne({ productId: product_orig.prodid })
        product = JSON.parse(JSON.stringify(product))
        return { price: product.stripe_price, quantity: product_orig.quan };
    })

    const link = await paymentLink(stripe_hidden, req, await Promise.all(products).then((products) => { return products }));

    const newOrder = new Order({
        name,
        orderId,
        line1,
        line2,
        line3,
        stripe_hidden,
        payment_link: link.url,
        userId: user.userId,
        status: false,
        cart: user.cart,
        date: dateStringWithTime
    })

    newOrder.save().then(async (order) => {
        await User.findOneAndUpdate(
            { userId: req.user.userId },
            { $push: { orders: orderId }, $set: { cart: [] } }
        ).then((user) => {
            res.send({ success: true, link: link.url })
        })
    })

})

router.get('/confirm-order/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    const order = await Order.findOne({ stripe_hidden: id })
    let total = 0
    if (order && order.status == false) {
        await Order.findOneAndUpdate({ stripe_hidden: id }, {status: true}).then((order) => {
            var products = order.cart.map(async (product_orig) => {
                var product = await Product.findOne({ productId: product_orig.prodid })
                product = JSON.parse(JSON.stringify(product))
                total += product.price * product_orig.quan
                product.quantity = product_orig.quan
                return product;
            })
            Promise.all(products).then(async products => {
                res.render('store/confirm-order', { user: req.user, products: products, order: order })
            }).catch(err => {
                console.log(err)
            })
        })
    } else if (order.status == true){
        res.redirect('/orders')
    } else {
        res.redirect('/store')
    };
})

module.exports = router;