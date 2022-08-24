const express = require('express'),
    router = express.Router(),
    User = require("../schemas/userSchema"),
    Product = require('../schemas/productSchema'),
    Order = require("../schemas/orderSchema");

router.get('/', async (req, res) => {
    const user = await User.findOne({ userId: req.user.userId })
    let orders = []
    for (let i = 0; i < user.orders.length; i++) {
        let foundOrder = await Order.findOne({ orderId: user.orders[i] })
        foundOrder = foundOrder.toObject()
        var total = 0;
        var products = foundOrder.cart.map(async (product_orig) => {
            var product = await Product.findOne({ productId: product_orig.prodid })
            product = JSON.parse(JSON.stringify(product))
            total += product.price * product_orig.quan
            product.quantity = product_orig.quan
            return product;
        })
        Promise.all(await products).then(async products => {
            foundOrder.cart = products
            foundOrder.total = total
            orders.push(foundOrder)
            if (i == user.orders.length-1) {
                var orderslist = await NewtestArray(orders)
                res.render('store/orders', {
                    orderslist, user: req.user
                })
            };
        })
    }
})

router.get('/:id', async (req, res) => {
    const order = await Order.findOne({ orderId: req.params.id })
    let products = []
    let total = 0
    order.cart.map(async product => {
        let foundProd = await Product.findOne({ productId: product.prodid })
        products.push(foundProd)
    })


    function render() {
        products.map(product => {
            total += product.price * product.quantity
        })
        res.render('store/order_single', {
            products, user: req.user, total, order
        })
    }

    setTimeout(render, 1000)
})

module.exports = router

// helper function to make array of products
async function NewtestArray(products) {
    var testArray = []
    var prodLen = products.length
    var i = 0

    if (prodLen == 0) {
        return testArray;
    }

    var NewtestArray = await new Promise((resolve, reject) => {
        while (i < prodLen) {
            i += 2
            testArray.push(products.splice(0, 3))

            if (i >= prodLen - 1) {
                resolve(testArray)
            }
            else {
                resolve(testArray)
            }
        }
    }).then(res => { return res })
    return NewtestArray
}
