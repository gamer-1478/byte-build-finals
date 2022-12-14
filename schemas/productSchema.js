const mongoose = require('mongoose'),
    reqString = { type: String, required: true },
    notreqString = { type: String, required: false },
    reqNum = {type: Number, required: true}

const productSchema = new mongoose.Schema({
    name: reqString,
    type: reqString,
    quantity: reqNum,
    description: reqString,
    productId: reqString,
    image: notreqString,
    price: reqNum,
    stripe_price: reqString,
    reviews:[{
        rating: reqNum,
        comment: notreqString,
        verified: {type: Boolean, default: false, required: true},
        name: reqString,
    }]
})

module.exports = mongoose.model("Product", productSchema)
