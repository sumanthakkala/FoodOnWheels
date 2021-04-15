const mongoose = require('mongoose')

const CouponSchema = mongoose.Schema({
    dateCreated: {
        type: Date,
        default: Date.now
    },
    couponCode: {
        type: String,
        required: true
    },
    couponPercentage: {
        type: Number,
        required: true
    }
})


module.exports = mongoose.model('Coupons', CouponSchema)