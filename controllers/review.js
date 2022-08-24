const Product = require('../schemas/productSchema')
    Order = require('../schemas/orderSchema')

const review_get = async(req, res)=>{
    const product = await Product.findOne({productId: req.params.id})
    res.render('store/review', {product})
}

const review_post = async(req, res)=>{
    const product = await Product.findOne({productId: req.params.id})
    console.log(product)
    res.send("ohk")
}

module.exports = {
    review_get,
    review_post
}