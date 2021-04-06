const express = require('express');
const { populate } = require('../models/Order');
const router = express.Router()
const Order = require('../models/Order')
require('dotenv/config');


router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        res.json(order)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err });
    }
});

router.get('/restaurant/:id', async (req, res) => {
    try {
        const order = await Order.find({ 'restaurantId': req.params.id });
        res.json(order)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const order = new Order({

        restaurantId: req.body.restaurantId,
        orderTotal: req.body.orderTotal,
        status: req.body.status,
        duration: req.body.duration,
        address: req.body.address,
        orderedMenu: req.body.orderedMenu
    });
    try {
        const savedOrder = await order.populate('restaurantId')
            .populate({
                path: 'orderedMenu',
                populate: {
                    path: 'menuItemId',
                    model: 'Restaurant.menu'
                }
            }).save();
        res.json(savedOrder)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err })
    }
})



router.post('/changeStatus', async (req, res) => {
    try {
        const result = await Order.findByIdAndUpdate(
            req.body.orderId,
            { $set: { status: req.body.status } }
        );
        res.json(result)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err })
    }
})

// router.delete('/:restaurantId', async (req, res) => {
//     try {
//         const removedRestaurant = await Restaurant.remove({ _id: req.params.restaurantId })
//         res.json(removedRestaurant)
//     }
//     catch (err) {
//         res.json({ message: err })
//     }
// })

// router.post('/add/menuIitem', uploadHelper, async (req, res) => {
//     const menuItemObj = {
//         name: req.body.name,
//         photo: process.env.BUCKET_ACCESS_PATH + req.file.filename,
//         description: req.body.description,
//         calories: parseFloat(req.body.calories),
//         price: parseFloat(req.body.price)
//     }
//     console.log(menuItemObj)
//     try {
//         const result = await Restaurant.findByIdAndUpdate(
//             req.body.restaurantId,
//             { $push: { menu: menuItemObj } }
//         );
//         const updatedRestaurant = await Restaurant.findById(req.body.restaurantId)
//         res.json(updatedRestaurant)
//     }
//     catch (err) {
//         console.log(err)
//         res.json({ message: err })
//     }
// })


module.exports = router;