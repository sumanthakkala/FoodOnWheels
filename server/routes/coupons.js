const express = require('express')
const router = express.Router()
const Coupon = require('../models/Coupon')
const fs = require('fs')
require('dotenv/config');

const uploadHelper = require('../middleware/upload')




router.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons)
    }
    catch (err) {
        res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const coupon = new Coupon({
        couponCode: req.body.couponCode,
        couponPercentage: req.body.couponPercentage,
    });
    try {
        const savedCoupon = await coupon.save();
        res.json(savedCoupon)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err })
    }
})

router.delete('/:couponId', async (req, res) => {
    try {
        const removedCoupon = await Coupon.remove({ _id: req.params.couponId })
        res.json(removedCoupon)
    }
    catch (err) {
        res.json({ message: err })
    }
})


module.exports = router;