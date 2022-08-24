const Product = require('../schemas/productSchema')
    Order = require('../schemas/orderSchema')
    User = require('../schemas/userSchema')

const review_post = async(req, res)=>{
    const user = await User.findOne({userId: req.user.userId})
    const product = await Product.findOne({productId: req.params.id})
    const userOrders = user.orders
    let verified = false
    userOrders.forEach(async userOrder => {
        let order = await Order.findOne({orderId: userOrder})
        let cart = order.cart
        cart.forEach(cartProduct => {
            if(cartProduct.prodid == req.params.id){
                verified = true
            }
        });
    })
    async function createSchema(){
        const {rating, comment} = req.body
        await Product.findOneAndUpdate({productId: req.params.id}, {
            $push: {reviews: {
                rating: parseInt(rating),
                comment,
                verified,
                name: req.user.name
            }}
        }).then((product)=> {
            console.log(product)
        })
    }
    setTimeout(createSchema, 1000);
    res.redirect('/store')
}

module.exports = {
    review_post
}