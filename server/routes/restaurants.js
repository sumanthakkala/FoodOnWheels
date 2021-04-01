const express = require('express')
const router = express.Router()
const Restaurant = require('../models/Restaurant')
require('dotenv/config');

const uploadHelper = require('../middleware/upload')

router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err });
    }
});

router.post('/', uploadHelper, async (req, res) => {
    const restaurant = new Restaurant({
        name: req.body.name,
        priceRating: req.body.priceRating,
        photo: process.env.BUCKET_ACCESS_PATH + req.file.filename,
        duration: req.body.duration,
        address: req.body.address,
        categories: JSON.parse(req.body.categories),
        menu: []
    });
    try {
        const savedRestaurant = await restaurant.populate('categories').save();
        res.json(savedRestaurant)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err })
    }
})

router.delete('/:restaurantId', async (req, res) => {
    try {
        const removedRestaurant = await Restaurant.remove({ _id: req.params.restaurantId })
        res.json(removedRestaurant)
    }
    catch (err) {
        res.json({ message: err })
    }
})


module.exports = router;