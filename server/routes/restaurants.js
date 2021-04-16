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

router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        res.json(restaurant)
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

router.post('/increaseVisitCount/:restaurantId', async (req, res) => {
    try {
        const result = await Restaurant.findByIdAndUpdate(
            req.params.restaurantId,
            { $inc: { visitCount: 1 } }
        );
        res.json(result)
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

router.post('/add/menuIitem', uploadHelper, async (req, res) => {
    const menuItemObj = {
        name: req.body.name,
        photo: process.env.BUCKET_ACCESS_PATH + req.file.filename,
        description: req.body.description,
        calories: parseFloat(req.body.calories),
        price: parseFloat(req.body.price)
    }
    console.log(menuItemObj)
    try {
        const result = await Restaurant.findByIdAndUpdate(
            req.body.restaurantId,
            { $push: { menu: menuItemObj } }
        );
        const updatedRestaurant = await Restaurant.findById(req.body.restaurantId)
        res.json(updatedRestaurant)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err })
    }
})

router.delete('/deleteMenuItem/:restaurantId/:menuItemId', async (req, res) => {
    console.log(req.params.menuItemId)
    console.log(req.body.restaurantId)
    try {
        const removedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.restaurantId,
            { $pull: { menu: { _id: req.params.menuItemId } } }
        );
        const updatedRestaurant = await Restaurant.findById(req.params.restaurantId)
        res.json(updatedRestaurant)
    }
    catch (err) {
        res.json({ message: err })
    }
})

module.exports = router;