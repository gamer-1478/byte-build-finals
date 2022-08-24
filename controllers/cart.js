const Product = require("../schemas/productSchema"),
    User = require("../schemas/userSchema"),
    {nanoid} = require("nanoid")

const cart_get = (req, res)=> {
    if (!req.user.cart.length > 0) {
        return res.render("store/cart", { user: req.user, cart: [], total: 0 });
    }
    var total = 0;
    var products = req.user.cart.map( async (product_orig)=> {
        var product = await Product.findOne({ productId: product_orig.prodid })
        product = JSON.parse(JSON.stringify(product))
        total += product.price * product_orig.quan
        product.quantity = product_orig.quan
        return product;
    })
    Promise.all(products).then(products => {
        res.render("store/cart", { user: req.user, cart: products, total: total})
    }).catch(err => {
        console.log(err)
    })
}

const cart_delete = (req, res)=> {
    var id = req.params.id;
    var cart = req.user.cart;
    var index = cart.findIndex(product => product.prodid === id);
    cart.splice(index, 1);
    req.user.cart = cart;
    req.user.save();
    res.send({ success: true });
}

const cart_quantity_change = (req, res)=> {
    var id = req.params.id;
    var cart = req.user.cart;
    var index = cart.findIndex(product => product.prodid === id);
    cart[index].quan = req.body.quantity;
    req.user.cart = cart;
    req.user.save();
    res.send({ success: true });
}


module.exports = {cart_get, cart_delete, cart_quantity_change}
